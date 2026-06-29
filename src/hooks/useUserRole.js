import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';

export function useUserRole() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRole() {
      try {
        await supabase.auth.refreshSession();
      } catch {
        // no active session to refresh; fall through to getUser()
      }
      const { data: { user } } = await supabase.auth.getUser();
      const r = user?.user_metadata?.role ?? 'partner';
      setRole(r);
      setLoading(false);
    }
    getRole();
  }, []);

  return {
    role,
    isAdmin: role === 'clx_admin',
    isPartner: role === 'partner',
    loading,
  };
}
