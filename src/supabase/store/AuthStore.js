import { create } from 'zustand';
import { supabase } from '../../supabaseClient';

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  error: null,

  // Fetch role metadata from public.profiles
  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (err) {
      console.error('Error syncing profile meta:', err.message);
    }
  },

  // Account Signup with metadata mapping
  register: async (email, password, name, role) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role // Handled by our SQL database trigger
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        set({ user: data.user });
        await get().fetchProfile(data.user.id);
      }
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Account Sign-in
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      set({ user: data.user });
      await get().fetchProfile(data.user.id);
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Session recovery across browser refreshes
  initializeAuth: async () => {
    set({ loading: true });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({ user: session.user });
      await get().fetchProfile(session.user.id);
    }
    set({ loading: false });

    // Live state listener subscription
    supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (currentSession?.user) {
        set({ user: currentSession.user });
        await get().fetchProfile(currentSession.user.id);
      } else {
        set({ user: null, profile: null });
      }
    });
  },

  // Account Logout
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error("Error signing out from Supabase:", err.message);
    } finally {

      set({ user: null, profile: null, error: null });
    }
  }
}));