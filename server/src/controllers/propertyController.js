import { setCache, getCache, invalidateCachePattern } from '../config/redis.js';
import { adminSupabase } from '../config/supabase.js';

export const getMyProperties = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const cacheKey = `owner:properties:${ownerId}`;

    // 1. Safe Cache Retrieval
    try {
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        const parsed = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
        if (Array.isArray(parsed)) {
          return res.status(200).json({
            success: true,
            source: 'cache',
            data: parsed,
          });
        }
      }
    } catch (cacheErr) {
      console.warn('Redis read fallback to DB:', cacheErr.message);
    }

    // 2. Database Fetch: properties -> rooms -> tenancies
    const { data, error } = await req.supabase
      .from('properties')
      .select(`
        id,
        name,
        address,
        created_at,
        rooms (
          id,
          room_number,
          base_rent,
          tenancies (
            id,
            invite_code,
            status,
            tenant_id,
            offline_tenant_name
          )
        )
      `)
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Collect all tenant_ids across active tenancies
    const tenantIds = [];
    (data || []).forEach((prop) => {
      (prop.rooms || []).forEach((rm) => {
        (rm.tenancies || []).forEach((t) => {
          if (t.tenant_id && !tenantIds.includes(t.tenant_id)) {
            tenantIds.push(t.tenant_id);
          }
        });
      });
    });

    const tenantMap = {};
    if (tenantIds.length > 0) {
      const { data: profiles } = await adminSupabase
        .from('profiles')
        .select('id, full_name')
        .in('id', tenantIds);
      (profiles || []).forEach((p) => {
        tenantMap[p.id] = p.full_name;
      });
    }

    // Flatten tenancies so the frontend gets is_occupied, tenant_code, and tenant_name cleanly
    const properties = (data || []).map((prop) => ({
      ...prop,
      rooms: (prop.rooms || []).map((rm) => {
        // Find the active lease
        const activeTenancy =
          rm.tenancies?.find((t) => t.status?.toLowerCase() === 'active') || null;
        
        // Fallback for code display if inactive
        const anyTenancy = activeTenancy || rm.tenancies?.[0] || null;

        // Priority: Real profile full_name > Offline owner-entered name
        const resolvedTenantName = 
          (activeTenancy?.tenant_id ? tenantMap[activeTenancy.tenant_id] : null) || 
          activeTenancy?.offline_tenant_name || 
          null;

        const isOccupied = Boolean(
          activeTenancy && (activeTenancy.tenant_id || activeTenancy.offline_tenant_name)
        );

        return {
          id: rm.id,
          tenancy_id: activeTenancy?.id || anyTenancy?.id || null,
          room_number: rm.room_number,
          base_rent: rm.base_rent,
          is_occupied: isOccupied,
          tenant_name: resolvedTenantName,
          tenant_code: anyTenancy?.invite_code || null,
        };
      }),
    }));

    // 3. Populate Redis Cache for 5 minutes
    try {
      await setCache(cacheKey, properties, 300);
    } catch (cacheErr) {
      console.warn('Redis write failure:', cacheErr.message);
    }

    return res.status(200).json({
      success: true,
      source: 'database',
      data: properties,
    });
  } catch (err) {
    next(err);
  }
};

export const createProperty = async (req, res, next) => {
  try {
    let name;
    let address;

    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        if (typeof parsed === 'object' && parsed !== null) {
          name = parsed.name;
          address = parsed.address;
        } else {
          name = parsed;
        }
      } catch {
        name = req.body;
      }
    } else if (req.body && typeof req.body === 'object') {
      name = req.body.name;
      address = req.body.address;
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Property name is required and cannot be empty.',
      });
    }

    const trimmedAddress =
      address && typeof address === 'string' && address.trim() !== ''
        ? address.trim()
        : null;

    const { data, error } = await req.supabase
      .from('properties')
      .insert({
        owner_id: req.user.id,
        name: name.trim(),
        address: trimmedAddress,
      })
      .select(`
        id,
        name,
        address,
        created_at,
        rooms (
          id,
          room_number,
          base_rent
        )
      `)
      .single();

    if (error) throw error;

    try {
      await invalidateCachePattern(`owner:properties:${req.user.id}*`);
    } catch (cacheErr) {
      console.warn('Redis cache invalidation warning:', cacheErr.message);
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (address !== undefined) updates.address = address ? address.trim() : null;

    const { data, error } = await req.supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .eq('owner_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    await invalidateCachePattern(`owner:properties:${req.user.id}*`);

    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await req.supabase
      .from('properties')
      .delete()
      .eq('id', id)
      .eq('owner_id', req.user.id);

    if (error) throw error;

    await invalidateCachePattern(`owner:properties:${req.user.id}*`);

    return res.status(200).json({ success: true, message: 'Property deleted successfully.' });
  } catch (err) {
    next(err);
  }
}; 