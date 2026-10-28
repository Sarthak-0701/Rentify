import crypto from 'crypto';
import { invalidateCachePattern } from '../config/redis.js';

export const createTenancy = async (req, res, next) => {
  try {
    const { property_id, room_id, rent_amount, start_date } = req.body;

    if (!property_id || !room_id || !rent_amount) {
      return res.status(400).json({
        success: false,
        error: 'property_id, room_id, and rent_amount are required.',
      });
    }

    const inviteCode = `RT-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const { data, error } = await req.supabase
      .from('tenancies')
      .insert({
        property_id,
        room_id,
        rent_amount: Number(rent_amount),
        start_date: start_date || new Date().toISOString().split('T')[0],
        status: 'active',
        invite_code: inviteCode,
      })
      .select()
      .single();

    if (error) throw error;

    await invalidateCachePattern(`owner:properties:${req.user.id}*`);

    return res.status(201).json({
      success: true,
      message: 'Tenancy created successfully.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const claimTenancy = async (req, res, next) => {
  try {
    const { invite_code } = req.body;
    if (!invite_code) {
      return res.status(400).json({ success: false, error: 'Invite code is required.' });
    }

    const { data, error } = await req.supabase
      .from('tenancies')
      .update({ tenant_id: req.user.id })
      .eq('invite_code', invite_code.trim())
      .is('tenant_id', null)
      .eq('status', 'active')
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Invalid, expired, or already claimed invite code.',
      });
    }

    await invalidateCachePattern(`receipts:user:${req.user.id}*`);

    return res.status(200).json({
      success: true,
      message: 'Room linked to your tenant profile successfully.',
      data,
    });
  } catch (error) {
    next(error);
  }
};