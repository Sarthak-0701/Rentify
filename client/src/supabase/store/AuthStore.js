import { create } from 'zustand';
import { supabase } from '../client';

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  error: null,

  // Fetch public profile metadata safely (using maybeSingle to prevent 406 crashes)
  fetchProfile: async (userId) => {
    if (!userId) {
      set({ profile: null });
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      set({ profile: data || null });
      return data;
    } catch (err) {
      console.error('Error syncing profile metadata:', err.message);
      set({ profile: null });
      return null;
    }
  },

  // One-time auth listener initialization
  initializeAuth: () => {
    set({ loading: true });

    // 1. Initial session load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        if (session?.user) {
          set({ user: session.user, session });
          await get().fetchProfile(session.user.id);
        } else {
          set({ user: null, session: null, profile: null });
        }
      } catch (err) {
        console.error('Session initialization error:', err.message);
        set({ user: null, session: null, profile: null });
      } finally {
        // Only mark loading false AFTER session AND profile have finished loading
        set({ loading: false });
      }
    });

    // 2. React to auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          set({ user: null, session: null, profile: null, loading: false });
          return;
        }

        if (session?.user) {
          set({ user: session.user, session });
          // If profile is not yet loaded, fetch it before disabling loading
          if (!get().profile || get().profile.id !== session.user.id) {
            await get().fetchProfile(session.user.id);
          }
          set({ loading: false });
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  },

  // User Registration
  register: async (email, password, name, role) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role.toLowerCase(),
          },
        },
      });

      if (error) throw error;

      if (data?.session) {
        set({ user: data.session.user, session: data.session });
        await get().fetchProfile(data.session.user.id);
      }
      return data;
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // User Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({ user: data.user, session: data.session });
      if (data.user?.id) {
        await get().fetchProfile(data.user.id);
      }
      return data;
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // User Logout
  logout: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      set({ user: null, session: null, profile: null, error: null, loading: false });
    }
  },
}));