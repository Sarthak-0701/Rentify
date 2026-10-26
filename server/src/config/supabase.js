import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if(!supabaseUrl || !supabaseAnonKey){
    throw new Error('Missing Supabase configuration keys');
}

export const createUserClient = (authToken) => {
    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
        },
    });
};

export const adminSupabase = supabaseServiceRoleKey ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false},
}) : null;
