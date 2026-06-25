import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';

export function usePartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('b2b_owners')
      .select('*')
      .order('business_name', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setPartners([]);
    } else {
      setPartners(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  async function upsertPartner(partner) {
    const payload = { ...partner, updated_at: new Date().toISOString() };
    const { data, error: upsertError } = await supabase
      .from('b2b_owners')
      .upsert(payload)
      .select()
      .single();

    if (upsertError) throw upsertError;
    await fetchPartners();
    return data;
  }

  async function setFlag(id, flagged, reason) {
    const { error: flagError } = await supabase
      .from('b2b_owners')
      .update({
        flagged_for_review: flagged,
        flag_reason: flagged ? reason ?? null : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (flagError) throw flagError;
    await fetchPartners();
  }

  return { partners, loading, error, refresh: fetchPartners, upsertPartner, setFlag };
}
