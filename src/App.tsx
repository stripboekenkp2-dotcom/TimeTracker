import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session) checkUserRole(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      if (session) checkUserRole(session.user);
      else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUserRole(currentUser: any) {
    // Vul hier je eigen Gmail-adres in voor admin-toegang
    const isEmployer = currentUser.email === 'admin@dynasty.com';

    if (isEmployer) {
      setUserRole('employer');
      setLoading(false);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (!profile) {
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert([{ id: currentUser.id, email: currentUser.email, role: 'employee' }])
          .select()
          .single();
        
        setUserRole(newProfile?.role || 'employee');
      } else {
        setUserRole(profile.role);
      }
    } catch (err) {
      console.error("Fout bij ophalen rol:", err);
      setUserRole('employee');
    }
    setLoading(false);
  }

  if (loading) {
    return <div style={{ padding: 50, textAlign: 'center', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#1a1a1a', height: '100vh' }}><h3>Dynasty Uren laden...</h3></div>;
  }

  if (!user) {
    return (
      <div style={{ padding: 50, textAlign: 'center', fontFamily: 'sans-serif', height: '100vh', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: '#fff', padding: 40, borderRadius: 8, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2>Dynasty Urenregistratie</h2>
          <p>Log in met je Google-account.</p>
          <button 
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
            style={{ padding: '12px 24px', fontSize: 16, cursor: 'pointer', backgroundColor: '#4285F4', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold' }}
          >
            Inloggen met Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <div style={{ background: '#1a1a1a', color: '#fff', padding: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 4 }}>
        <span>Ingelogd als: {user.email} (Rol: {userRole})</span>
        <button onClick={() => supabase.auth.signOut()} style={{ cursor: 'pointer', padding: '5px 10px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4 }}>Uitloggen</button>
      </div>

      <div style={{ marginTop: 20, padding: 20, border: '1px solid #ccc', borderRadius: 4, backgroundColor: '#fff' }}>
        <h3>Dashboard Informatie</h3>
        {userRole === 'employer' ? (
          <div>
            <p>📢 Je bent ingelogd als Werkgever.</p>
            <p style={{ color: '#666', fontStyle: 'italic' }}>Koppel hier later je EmployerDashboard component aan.</p>
          </div>
        ) : (
          <div>
            <p>⏱️ Je bent ingelogd als Werknemer.</p>
            <p style={{ color: '#666', fontStyle: 'italic' }}>Koppel hier later je EmployeeDashboard component aan.</p>
          </div>
        )}
      </div>
    </div>
  );
}