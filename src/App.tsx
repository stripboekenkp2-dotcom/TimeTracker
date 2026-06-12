import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import EmployerDashboard from './components/EmployerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Luister naar in- en uitloggen
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkUserRole(session.user);
      else setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkUserRole(session.user);
      else {
        setUserRole(null);
        setLoading(false);
      }
    });
  }, []);

  // Automatische aanmaak en check van rol bij Gmail Login
  async function checkUserRole(user: any) {
    let { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Als de werknemer voor het eerst inlogt via Gmail, bestaat het profiel nog niet
    if (!profile) {
      // Vul hier JOUW eigen Gmail in om jezelf automatisch als werkgever te markeren!
      const isEmployer = user.email === 'JOUW_EIGEN_GMAIL@gmail.com'; 
      
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id, 
            email: user.email, 
            full_name: user.user_metadata.full_name || 'Nieuwe Werknemer',
            role: isEmployer ? 'employer' : 'employee' 
          }
        ])
        .select()
        .single();
      
      setUserRole(newProfile?.role || 'employee');
    } else {
      setUserRole(profile.role);
    }
    setLoading(false);
  }

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Laden...</div>;

  // Als er niemand is ingelogd, toon het Gmail inlogscherm
  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Urenregistratie Login</h1>
        <button 
          onClick={loginWithGoogle}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Inloggen met Gmail
        </button>
      </div>
    );
  }

  // Toon dashboard op basis van de rol in de database
  return (
    <div>
      {userRole === 'employer' ? (
        <EmployerDashboard session={session} />
      ) : (
        <EmployeeDashboard session={session} />
      )}
    </div>
  );
}