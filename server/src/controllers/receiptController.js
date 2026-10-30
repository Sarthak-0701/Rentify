import { generateReceiptSchema } from '../validators/receiptValidator.js';
import { getCache, setCache, invalidateCachePattern } from '../config/redis.js';

export const generateReceipt = async (req, res, next) => {
  try {
    const validated = generateReceiptSchema.parse(req.body);

    const { data: tenancy, error: tenancyError } = await req.supabase
      .from('tenancies')
      .select('id, rent_amount, tenant_id')
      .eq('id', validated.tenancy_id)
      .eq('status', 'active')
      .single();

    if (tenancyError || !tenancy) {
      return res.status(404).json({
        success: false,
        error: 'Active tenancy record not found or inaccessible.',
      });
    }

    const baseRent = Number(tenancy.rent_amount);
    const unitsConsumed = validated.new_reading - validated.old_reading;
    const electricityTotal = unitsConsumed * validated.electricity_rate;
    const waterCharges = validated.water_charges || 0;
    const trashCharges = validated.trash_charges || 0;
    const previousBalance = validated.previous_balance || 0;

    const totalBill = Number(
      (baseRent + electricityTotal + waterCharges + trashCharges + previousBalance).toFixed(2)
    );

    const { data: receipt, error: insertError } = await req.supabase
      .from('receipts')
      .insert({
        tenancy_id: tenancy.id,
        owner_id: req.user.id,
        tenant_id: tenancy.tenant_id,
        billing_date: validated.billing_date,
        base_rent: baseRent,
        old_reading: validated.old_reading,
        new_reading: validated.new_reading,
        electricity_rate: validated.electricity_rate,
        water_charges: waterCharges,
        trash_charges: trashCharges,
        previous_balance: previousBalance,
        total_bill: totalBill,
        status: 'unpaid',
      })
      .select()
      .single();

    if (insertError) throw insertError;

    await invalidateCachePattern(`receipts:user:${req.user.id}*`);
    if (tenancy.tenant_id) {
      await invalidateCachePattern(`receipts:user:${tenancy.tenant_id}*`);
    }

    return res.status(201).json({
      success: true,
      message: 'Receipt generated successfully.',
      data: receipt,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyReceipts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const cacheKey = `receipts:user:${userId}:page:${page}:limit:${limit}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return res.status(200).json({ success: true, source: 'cache', ...cachedData });
    }

    const { data, error, count } = await req.supabase
      .from('receipts')
      .select(`
        *,
        tenancies (
          id,
          tenant_id,
          room_id,
          rent_amount,
          rooms (
            id,
            room_number,
            property_id,
            properties (
              id,
              name,
              address
            )
          )
        )
      `)
      .order('billing_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const enrichedData = (data || []).map((r) => ({
      ...r,
      room_id: r.room_id || r.tenancies?.room_id || r.tenancies?.rooms?.id || null,
      property_id: r.property_id || r.tenancies?.rooms?.property_id || r.tenancies?.rooms?.properties?.id || null,
      room_number: r.tenancies?.rooms?.room_number || null,
      property_name: r.tenancies?.rooms?.properties?.name || null,
    }));

    const responsePayload = {
      data: enrichedData,
      pagination: {
        page,
        limit,
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
      },
    };

    await setCache(cacheKey, responsePayload, 60);

    return res.status(200).json({ success: true, source: 'database', ...responsePayload });
  } catch (error) {
    next(error);
  }
};

export const updateReceiptStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['paid', 'unpaid'].includes(status?.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Status must be paid or unpaid.' });
    }

    const { data, error } = await req.supabase
      .from('receipts')
      .update({ status: status.toLowerCase() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await invalidateCachePattern(`receipts:user:${req.user.id}*`);
    if (data?.tenant_id) {
      await invalidateCachePattern(`receipts:user:${data.tenant_id}*`);
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;
    const {
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
    } = req.body;

    const { data: existingReceipt, error: fetchErr } = await req.supabase
      .from('receipts')
      .select('id, owner_id, tenant_id')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .maybeSingle();

    if (fetchErr || !existingReceipt) {
      return res.status(404).json({ success: false, error: 'Receipt not found or unauthorized.' });
    }

    const updates = {};
    if (billing_date !== undefined) updates.billing_date = billing_date;
    if (base_rent !== undefined) updates.base_rent = Number(base_rent);
    if (old_reading !== undefined) updates.old_reading = Number(old_reading);
    if (new_reading !== undefined) updates.new_reading = Number(new_reading);
    if (electricity_rate !== undefined) updates.electricity_rate = Number(electricity_rate);
    if (water_charges !== undefined) updates.water_charges = Number(water_charges);
    if (trash_charges !== undefined) updates.trash_charges = Number(trash_charges);
    if (previous_balance !== undefined) updates.previous_balance = Number(previous_balance);
    if (total_bill !== undefined) updates.total_bill = Number(total_bill);
    if (status !== undefined) {
      const s = status.toLowerCase();
      updates.status = s === 'pending' ? 'unpaid' : s;
    }

    const { data: updated, error: updateErr } = await req.supabase
      .from('receipts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    await invalidateCachePattern(`receipts:user:${ownerId}*`);
    if (existingReceipt.tenant_id) {
      await invalidateCachePattern(`receipts:user:${existingReceipt.tenant_id}*`);
    }

    return res.status(200).json({ success: true, message: 'Receipt updated successfully.', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;

    const { data: existingReceipt } = await req.supabase
      .from('receipts')
      .select('id, owner_id, tenant_id')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .maybeSingle();

    if (!existingReceipt) {
      return res.status(404).json({ success: false, error: 'Receipt not found or unauthorized.' });
    }

    const { error: delErr } = await req.supabase
      .from('receipts')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId);

    if (delErr) throw delErr;

    await invalidateCachePattern(`receipts:user:${ownerId}*`);
    if (existingReceipt.tenant_id) {
      await invalidateCachePattern(`receipts:user:${existingReceipt.tenant_id}*`);
    }

    return res.status(200).json({ success: true, message: 'Receipt deleted successfully.' });
  } catch (err) {
    next(err);
  }
};