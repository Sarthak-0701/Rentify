import { z } from 'zod';

export const generateReceiptSchema = z.object({
    tenancy_id: z.string().uuid({ message: 'Valid tenancy UUID is required' }),
    billing_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date format must be YYYY-MM-DD' }),
    old_reading: z.number().min(0, 'Old reading must be non-negative'),
    new_reading: z.number().min(0, 'New reading must be non-negative'),
    electricity_rate: z.number().min(0, 'Electricity rate must be non-negative'),
    water_charges: z.number().min(0, 'Water charges must be non-negative').default(0),
    trash_charges: z.number().min(0, 'Trash charges must be non-negative').default(0),
    previous_balance: z.number().default(0),
}).refine((data) => data.new_reading >= data.old_reading, {
    message: 'New electricity reading cannot be less than old reading',
    path: ['new_reading'],
});