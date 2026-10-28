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

    const responsePayload = {
      data,
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