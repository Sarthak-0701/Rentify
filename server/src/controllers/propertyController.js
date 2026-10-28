import { setCache, getCache, invalidateCachePattern } from '../config/redis.js';

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

    // 2. Database Fetch Scoped to Authenticated Owner
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
          base_rent
        )
      `)
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const properties = data || [];

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

    // Handle edge cases where req.body arrives as a primitive or stringified JSON
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

    // Validation: ensure name is a non-empty string
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

    // Insert new property scoped to authenticated owner
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

    // Invalidate stale cache for this owner
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