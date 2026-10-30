import { adminSupabase } from '../config/supabase.js';
import { invalidateCachePattern } from '../config/redis.js';
import crypto from 'crypto';

// 1. CREATE ROOM
export const createRoom = async (req, res, next) => {
  try {
    const { property_id, room_number, base_rent, is_occupied, tenant_name } = req.body;

    if (!property_id) {
      return res.status(400).json({
        success: false,
        message: 'property_id is required.',
      });
    }

    if (!room_number || String(room_number).trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'room_number is required.',
      });
    }

    // Verify property ownership
    const { data: property, error: propErr } = await req.supabase
      .from('properties')
      .select('id')
      .eq('id', property_id)
      .eq('owner_id', req.user.id)
      .single();

    if (propErr || !property) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not own this property.',
      });
    }

    // Insert room
    const { data: room, error: roomErr } = await req.supabase
      .from('rooms')
      .insert({
        property_id,
        room_number: String(room_number).trim(),
        base_rent: Number(base_rent) || 0,
      })
      .select()
      .single();

    if (roomErr) throw roomErr;

    // Generate permanent room invite code using crypto module
    const inviteCode = 'RENT-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const occupied = Boolean(is_occupied);
    const cleanTenantName = occupied && tenant_name && String(tenant_name).trim() !== ''
      ? String(tenant_name).trim()
      : null;

    // Insert linked tenancy via adminSupabase (bypasses RLS so invite code & tenancy are guaranteed to persist)
    const dbClient = adminSupabase || req.supabase;
    const { data: tenancy, error: tenancyErr } = await dbClient
      .from('tenancies')
      .insert({
        property_id,
        room_id: room.id,
        tenant_id: null,
        rent_amount: Number(base_rent) || 0,
        status: 'active',
        offline_tenant_name: cleanTenantName,
        invite_code: inviteCode,
        start_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (tenancyErr) {
      console.error('Tenancy creation error:', tenancyErr.message);
      throw tenancyErr;
    }

    try {
      await invalidateCachePattern(`owner:properties:${req.user.id}*`);
    } catch (cacheErr) {
      console.warn('Cache invalidation warning:', cacheErr.message);
    }

    return res.status(201).json({
      success: true,
      data: {
        ...room,
        is_occupied: occupied,
        tenant_name: cleanTenantName,
        tenant_code: tenancy?.invite_code || inviteCode,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 2. GET ROOM BY ID
export const getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await req.supabase
      .from('rooms')
      .select(`
        id,
        room_number,
        base_rent,
        property_id,
        properties (
          id,
          name,
          address,
          owner_id
        ),
        tenancies (
          id,
          tenant_id,
          offline_tenant_name,
          rent_amount,
          invite_code,
          status,
          receipts (
            id,
            tenancy_id,
            owner_id,
            tenant_id,
            billing_date,
            base_rent,
            old_reading,
            new_reading,
            electricity_rate,
            water_charges,
            trash_charges,
            previous_balance,
            total_bill,
            status,
            created_at
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    // Enrich tenancies with tenant profile names if tenant_id exists
    if (data.tenancies && data.tenancies.length > 0) {
      const tenantIds = data.tenancies.map((t) => t.tenant_id).filter(Boolean);
      if (tenantIds.length > 0) {
        const { data: profiles } = await adminSupabase
          .from('profiles')
          .select('id, full_name')
          .in('id', tenantIds);
        const pMap = {};
        (profiles || []).forEach((p) => {
          pMap[p.id] = p.full_name;
        });
        data.tenancies = data.tenancies.map((t) => ({
          ...t,
          profiles: t.tenant_id ? { full_name: pMap[t.tenant_id] || null } : null,
        }));
      }
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// 3. UPDATE ROOM
export const updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { room_number, base_rent, is_occupied, tenant_name } = req.body;
    const dbClient = adminSupabase || req.supabase;

    const updates = {};
    if (room_number !== undefined) updates.room_number = String(room_number).trim();
    if (base_rent !== undefined) updates.base_rent = Number(base_rent);

    const { data, error } = await req.supabase
      .from('rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Check existing room tenancy
    const { data: existingTenancy } = await dbClient
      .from('tenancies')
      .select('id, invite_code')
      .eq('room_id', id)
      .maybeSingle();

    if (existingTenancy) {
      const tenancyUpdates = {};
      if (base_rent !== undefined) {
        tenancyUpdates.rent_amount = Number(base_rent);
      }

      if (is_occupied !== undefined || tenant_name !== undefined) {
        const occupied = Boolean(is_occupied);
        if (occupied) {
          tenancyUpdates.status = 'active';
          if (tenant_name !== undefined) {
            tenancyUpdates.offline_tenant_name = tenant_name ? String(tenant_name).trim() : null;
          }
        } else {
          // Vacating the room: clear offline name and linked tenant id, keep status active
          tenancyUpdates.status = 'active';
          tenancyUpdates.offline_tenant_name = null;
          tenancyUpdates.tenant_id = null;
        }
      }

      if (Object.keys(tenancyUpdates).length > 0) {
        await dbClient
          .from('tenancies')
          .update(tenancyUpdates)
          .eq('id', existingTenancy.id);
      }
    } else {
      // If no tenancy existed, provision a new one with a fresh invite code
      const inviteCode = 'RENT-' + crypto.randomBytes(3).toString('hex').toUpperCase();
      const occupied = Boolean(is_occupied);
      await dbClient.from('tenancies').insert({
        property_id: data.property_id,
        room_id: id,
        tenant_id: null,
        rent_amount: Number(data.base_rent) || 0,
        status: 'active',
        offline_tenant_name: occupied && tenant_name ? String(tenant_name).trim() : null,
        invite_code: inviteCode,
        start_date: new Date().toISOString().split('T')[0],
      });
    }

    try {
      await invalidateCachePattern(`owner:properties:${req.user.id}*`);
    } catch (cacheErr) {
      console.warn('Cache invalidation warning:', cacheErr.message);
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// 4. DELETE ROOM
export const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbClient = adminSupabase || req.supabase;

    // Remove linked tenancies (and cascade receipts if any)
    const { data: linkedTenancies } = await dbClient
      .from('tenancies')
      .select('id')
      .eq('room_id', id);

    if (linkedTenancies && linkedTenancies.length > 0) {
      const tenancyIds = linkedTenancies.map((t) => t.id);
      await dbClient.from('receipts').delete().in('tenancy_id', tenancyIds);
      await dbClient.from('tenancies').delete().eq('room_id', id);
    }

    const { error } = await req.supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) throw error;

    try {
      await invalidateCachePattern(`owner:properties:${req.user.id}*`);
    } catch (cacheErr) {
      console.warn('Cache invalidation warning:', cacheErr.message);
    }

    return res.status(200).json({ success: true, message: 'Room deleted successfully.' });
  } catch (err) {
    next(err);
  }
};