
import { adminSupabase } from '../config/supabase.js';
import { invalidateCachePattern } from '../config/redis.js';
import crypto from 'crypto';

// --- 1. TENANT: REQUEST ROOM LINK (Max 3 concurrent, 6hr per-room cooldown) ---
export const requestTenancyLink = async (req, res, next) => {
  try {
    const { invite_code } = req.body;
    const tenantId = req.user.id;

    if (!invite_code || typeof invite_code !== 'string' || !invite_code.trim()) {
      return res.status(400).json({ success: false, error: 'Invite code is required.' });
    }

    const cleanCode = invite_code.trim().toUpperCase();

    // A. Check total active pending requests by this tenant (Max 3)
    const { data: currentPendingRequests, error: countErr } = await adminSupabase
      .from('tenancies')
      .select('id, room_id, requested_at')
      .eq('tenant_id', tenantId)
      .eq('status', 'pending');

    if (countErr) throw countErr;

    if (currentPendingRequests && currentPendingRequests.length >= 3) {
      return res.status(400).json({
        success: false,
        error: 'You have reached the maximum limit of 3 active room requests. Please cancel an existing request or wait for an owner decision.',
      });
    }

    // B. Find target room tenancy by invite code
    const { data: targetTenancy, error: findErr } = await adminSupabase
      .from('tenancies')
      .select('id, property_id, room_id, rent_amount, tenant_id, status, invite_code')
      .eq('invite_code', cleanCode)
      .limit(1)
      .maybeSingle();

    if (findErr || !targetTenancy) {
      return res.status(404).json({ success: false, error: 'Invalid or non-existent room invite code.' });
    }

    if (targetTenancy.status?.toLowerCase() === 'active' && targetTenancy.tenant_id === tenantId) {
      return res.status(400).json({ success: false, error: 'You are already the active tenant of this room.' });
    }

    // Fetch room & property details directly by ID to avoid schema cache relationship issues
    const [roomRes, propertyRes] = await Promise.all([
      adminSupabase
        .from('rooms')
        .select('id, room_number, base_rent')
        .eq('id', targetTenancy.room_id)
        .maybeSingle(),
      adminSupabase
        .from('properties')
        .select('id, name, address')
        .eq('id', targetTenancy.property_id)
        .maybeSingle(),
    ]);

    const roomNumber = roomRes.data?.room_number || '';
    const propertyName = propertyRes.data?.name || '';

    // C. Prevent duplicate pending request for this same room
    const { data: existingPending } = await adminSupabase
      .from('tenancies')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('room_id', targetTenancy.room_id)
      .eq('status', 'pending')
      .maybeSingle();

    if (existingPending) {
      return res.status(400).json({
        success: false,
        error: `You already have an active request pending for Room ${roomNumber}. Please wait for owner approval.`,
      });
    }

    // D. 6-Hour Cooldown check for THIS SPECIFIC ROOM
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    const { data: recentRoomRequest } = await adminSupabase
      .from('tenancies')
      .select('id, requested_at')
      .eq('tenant_id', tenantId)
      .eq('room_id', targetTenancy.room_id)
      .gt('requested_at', sixHoursAgo)
      .order('requested_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentRoomRequest) {
      const waitMinutes = Math.ceil(
        (new Date(recentRoomRequest.requested_at).getTime() + 6 * 60 * 60 * 1000 - Date.now()) / (1000 * 60)
      );
      return res.status(429).json({
        success: false,
        error: `Cooldown active: You requested Room ${roomNumber} recently. Please wait ${waitMinutes} more minute(s) before requesting this room again.`,
      });
    }

    // E. Insert pending request with invite_code: null to strictly satisfy Postgres UNIQUE constraint
    const { data: pendingRecord, error: insertErr } = await adminSupabase
      .from('tenancies')
      .insert({
        property_id: targetTenancy.property_id,
        room_id: targetTenancy.room_id,
        tenant_id: tenantId,
        rent_amount: targetTenancy.rent_amount || roomRes.data?.base_rent || 0,
        status: 'pending',
        invite_code: null,
        requested_at: new Date().toISOString(),
      })
      .select('id, status, requested_at, property_id, room_id')
      .single();

    if (insertErr) throw insertErr;

    await invalidateCachePattern(`receipts:user:${tenantId}*`);

    return res.status(201).json({
      success: true,
      message: `Request submitted for Room ${roomNumber} (${propertyName}). Waiting for landlord review.`,
      data: {
        ...pendingRecord,
        invite_code: cleanCode,
        properties: propertyRes.data,
        rooms: roomRes.data,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --- 2. TENANT: GET ALL ACTIVE REQUESTS (Up to 3) ---
export const getTenantActiveRequests = async (req, res, next) => {
  try {
    const tenantId = req.user.id;

    const { data: pendingList, error } = await adminSupabase
      .from('tenancies')
      .select('id, status, requested_at, room_id, property_id, rent_amount')
      .eq('tenant_id', tenantId)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false });

    if (error) throw error;

    // Enrich requests with room, property, and invite code
    const enriched = await Promise.all(
      (pendingList || []).map(async (item) => {
        const [roomRes, propertyRes, activeTenancyRes] = await Promise.all([
          adminSupabase
            .from('rooms')
            .select('id, room_number, base_rent')
            .eq('id', item.room_id)
            .maybeSingle(),
          adminSupabase
            .from('properties')
            .select('id, name, address')
            .eq('id', item.property_id)
            .maybeSingle(),
          adminSupabase
            .from('tenancies')
            .select('invite_code')
            .eq('room_id', item.room_id)
            .eq('status', 'active')
            .maybeSingle(),
        ]);

        return {
          id: item.id,
          status: item.status,
          requested_at: item.requested_at,
          invite_code: activeTenancyRes.data?.invite_code || null,
          properties: propertyRes.data || null,
          rooms: roomRes.data || null,
        };
      })
    );

    return res.status(200).json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
};

// --- 3. TENANT: CANCEL REQUEST ---
export const cancelTenantRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.id;

    const { error } = await adminSupabase
      .from('tenancies')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .eq('status', 'pending');

    if (error) throw error;

    return res.status(200).json({ success: true, message: 'Request cancelled successfully.' });
  } catch (err) {
    next(err);
  }
};

// --- 4. OWNER: GET PENDING REQUESTS ---
export const getOwnerPendingRequests = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    // 1. Get properties owned by this owner
    const { data: properties, error: propErr } = await req.supabase
      .from('properties')
      .select('id, name, address')
      .eq('owner_id', ownerId);

    if (propErr) throw propErr;
    const propertyIds = (properties || []).map((p) => p.id);
    const propertyMap = {};
    (properties || []).forEach((p) => {
      propertyMap[p.id] = p;
    });

    if (propertyIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // 2. Fetch all pending requests across owner's properties
    const { data: pendingRequests, error } = await adminSupabase
      .from('tenancies')
      .select('id, room_id, property_id, requested_at, rent_amount, tenant_id')
      .in('property_id', propertyIds)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false });

    if (error) throw error;

    // 3. Enrich each request with room, applicant profile, invite code, and current occupant
    const enriched = await Promise.all(
      (pendingRequests || []).map(async (reqItem) => {
        const [profileRes, roomRes, activeTenancyRes] = await Promise.all([
          reqItem.tenant_id
            ? adminSupabase.from('profiles').select('id, full_name').eq('id', reqItem.tenant_id).maybeSingle()
            : Promise.resolve({ data: null }),
          adminSupabase
            .from('rooms')
            .select('id, room_number, base_rent')
            .eq('id', reqItem.room_id)
            .maybeSingle(),
          adminSupabase
            .from('tenancies')
            .select('id, tenant_id, offline_tenant_name, invite_code')
            .eq('room_id', reqItem.room_id)
            .eq('status', 'active')
            .neq('id', reqItem.id)
            .maybeSingle(),
        ]);

        let occupantName = activeTenancyRes.data?.offline_tenant_name || null;
        if (activeTenancyRes.data?.tenant_id) {
          const { data: occProfile } = await adminSupabase
            .from('profiles')
            .select('full_name')
            .eq('id', activeTenancyRes.data.tenant_id)
            .maybeSingle();
          if (occProfile?.full_name) {
            occupantName = occProfile.full_name;
          }
        }

        return {
          id: reqItem.id,
          room_id: reqItem.room_id,
          property_id: reqItem.property_id,
          requested_at: reqItem.requested_at,
          rent_amount: reqItem.rent_amount,
          tenant_id: reqItem.tenant_id,
          invite_code: activeTenancyRes.data?.invite_code || null,
          current_occupant: occupantName,
          profiles: profileRes.data || null,
          rooms: roomRes.data || null,
          properties: propertyMap[reqItem.property_id] || null,
        };
      })
    );

    return res.status(200).json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
};

// --- 5. OWNER: ACCEPT REQUEST (Updates Room Tenancy to new Tenant & Clears Request) ---
export const acceptTenancyRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;

    // 1. Fetch pending tenancy request
    const { data: pendingTenancy, error: fetchErr } = await adminSupabase
      .from('tenancies')
      .select('id, property_id, room_id, tenant_id, rent_amount')
      .eq('id', id)
      .eq('status', 'pending')
      .maybeSingle();

    if (fetchErr || !pendingTenancy) {
      return res.status(404).json({ success: false, error: 'Pending request not found.' });
    }

    // Verify owner owns this property
    const { data: property, error: propErr } = await adminSupabase
      .from('properties')
      .select('id, owner_id')
      .eq('id', pendingTenancy.property_id)
      .maybeSingle();

    if (propErr || !property || property.owner_id !== ownerId) {
      return res.status(403).json({ success: false, error: 'Unauthorized: You do not own this property.' });
    }

    // 2. Find the room's primary tenancy row that holds the room's invite code
    const { data: primaryTenancies } = await adminSupabase
      .from('tenancies')
      .select('id, invite_code')
      .eq('room_id', pendingTenancy.room_id)
      .not('invite_code', 'is', null)
      .limit(1);

    const primaryTenancy = primaryTenancies?.[0] || null;

    let updatedTenancy;

    if (primaryTenancy) {
      // Update existing primary tenancy with approved tenant id, clear offline name, keep invite code intact
      const { data: updated, error: updateErr } = await adminSupabase
        .from('tenancies')
        .update({
          tenant_id: pendingTenancy.tenant_id,
          offline_tenant_name: null,
          rent_amount: pendingTenancy.rent_amount || undefined,
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
        })
        .eq('id', primaryTenancy.id)
        .select()
        .single();

      if (updateErr) throw updateErr;
      updatedTenancy = updated;

      // Delete the pending request row
      await adminSupabase.from('tenancies').delete().eq('id', id);
    } else {
      // If no prior tenancy existed with invite code, assign fresh invite code and activate this row
      const newInviteCode = 'RENT-' + crypto.randomBytes(3).toString('hex').toUpperCase();
      const { data: activated, error: actErr } = await adminSupabase
        .from('tenancies')
        .update({
          status: 'active',
          invite_code: newInviteCode,
          start_date: new Date().toISOString().split('T')[0],
        })
        .eq('id', id)
        .select()
        .single();

      if (actErr) throw actErr;
      updatedTenancy = activated;
    }

    // 3. Clear any remaining competing pending requests for this room
    await adminSupabase
      .from('tenancies')
      .delete()
      .eq('room_id', pendingTenancy.room_id)
      .eq('status', 'pending');

    // 4. Invalidate Redis caches
    await invalidateCachePattern(`owner:properties:${ownerId}*`);
    if (pendingTenancy.tenant_id) {
      await invalidateCachePattern(`receipts:user:${pendingTenancy.tenant_id}*`);
    }

    return res.status(200).json({
      success: true,
      message: 'Tenant approved and active occupancy updated.',
      data: updatedTenancy,
    });
  } catch (err) {
    next(err);
  }
};

// --- 6. OWNER: DECLINE REQUEST ---
export const declineTenancyRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;

    const { data: pendingTenancy, error: fetchErr } = await adminSupabase
      .from('tenancies')
      .select('id, property_id')
      .eq('id', id)
      .eq('status', 'pending')
      .maybeSingle();

    if (fetchErr || !pendingTenancy) {
      return res.status(404).json({ success: false, error: 'Pending request not found.' });
    }

    const { data: property, error: propErr } = await adminSupabase
      .from('properties')
      .select('id, owner_id')
      .eq('id', pendingTenancy.property_id)
      .maybeSingle();

    if (propErr || !property || property.owner_id !== ownerId) {
      return res.status(403).json({ success: false, error: 'Unauthorized.' });
    }

    await adminSupabase.from('tenancies').delete().eq('id', id);

    return res.status(200).json({ success: true, message: 'Request declined.' });
  } catch (err) {
    next(err);
  }
};

// --- 7. TENANT: GET MY ACTIVE RENTALS ---
export const getTenantActiveRentals = async (req, res, next) => {
  try {
    const tenantId = req.user.id;

    const { data: tenancies, error } = await adminSupabase
      .from('tenancies')
      .select('id, property_id, room_id, rent_amount, start_date, invite_code, status')
      .eq('tenant_id', tenantId)
      .eq('status', 'active');

    if (error) throw error;

    if (!tenancies || tenancies.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const formatted = await Promise.all(
      tenancies.map(async (t) => {
        const [roomRes, propRes] = await Promise.all([
          t.room_id
            ? adminSupabase.from('rooms').select('id, room_number, base_rent').eq('id', t.room_id).maybeSingle()
            : Promise.resolve({ data: null }),
          t.property_id
            ? adminSupabase.from('properties').select('id, name, address, owner_id').eq('id', t.property_id).maybeSingle()
            : Promise.resolve({ data: null }),
        ]);

        let ownerName = 'Landlord';
        if (propRes.data?.owner_id) {
          const { data: ownerProfile } = await adminSupabase
            .from('profiles')
            .select('full_name')
            .eq('id', propRes.data.owner_id)
            .maybeSingle();
          if (ownerProfile?.full_name) {
            ownerName = ownerProfile.full_name;
          }
        }

        return {
          id: roomRes.data?.id || t.id,
          tenancy_id: t.id,
          room_number: roomRes.data?.room_number || '',
          base_rent: t.rent_amount || roomRes.data?.base_rent || 0,
          tenant_code: t.invite_code,
          invite_code: t.invite_code,
          start_date: t.start_date,
          properties: {
            id: propRes.data?.id,
            name: propRes.data?.name || 'Property',
            address: propRes.data?.address,
            owner_id: propRes.data?.owner_id,
            owner_name: ownerName,
          },
        };
      })
    );

    return res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};