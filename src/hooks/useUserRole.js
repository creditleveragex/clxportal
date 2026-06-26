import { useAuth } from './useAuth.js';

export function useUserRole() {
  const { session } = useAuth();
  const role = session?.user?.user_metadata?.role ?? null;
  const isAdmin = role === 'clx_admin';
  const isPartner = !isAdmin;

  return { role, isAdmin, isPartner };
}
