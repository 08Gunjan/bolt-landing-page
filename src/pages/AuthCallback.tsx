import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (!mounted) return;
      if (error) {
        setErr(error.message);
        return;
      }
      const redirect = params.get('redirect') || '/';
      // let supabase persist to storage before navigating
      setTimeout(() => navigate(redirect, { replace: true }), 0);
    })();
    return () => { mounted = false; };
  }, [navigate, params]);

  if (err) return <div style={{ padding: 24 }}>Authentication failed: {err}</div>;
  return <div style={{ padding: 24 }}>Signing you in…</div>;
}