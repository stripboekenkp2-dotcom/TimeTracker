import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { EmployerDashboard } from './components/EmployerDashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) checkUserRole(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
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
    // VERVANG DIT DOOR JOUW EIGEN GMAIL ADRES
    const isEmployer = currentUser.email === 'JOUW_EIGEN_GMAIL@gmail.com';

    if (isEmployer) {
      setUserRole('employer');
      setLoading(false);
      return;
    }

    let { data: profile } = await supabase
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
    setLoading(false);
  }

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <h3>Dynasty Uren laden...</h3>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f5f5f5' }}>
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h1 style={{ color: '#1a1a1a', marginBottom: '10px' }}>Dynasty Urenregistratie</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>Log in met je werk-Gmail om uren te schrijven of in te zien.</p>
          <button onClick={handleLogin} style={{ backgroundColor: '#4285F4', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
            Inloggen met Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'between', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <span style={{ fontWeight: 'bold' }}>Dynasty Uren - Ingelogd als: {user.email}</span>
        <button onClick={handleLogout} style={{ backgroundColor: '#d32f2f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto' }}>
          Uitloggen
        </button>
      </div>

      {userRole === 'employer' ? (
        <EmployerDashboard />
      ) : (
        <EmployeeDashboard userId={user.id} />
      )}
    </div>
  );
}