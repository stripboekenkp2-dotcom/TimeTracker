import React, { useState, useEffect } from "react";
import { EmployerDashboard } from "./components/EmployerDashboard";
import { EmployeeDashboard } from "./components/EmployeeDashboard";

// Een eenvoudige mock-auth om de login te simuleren/beheren
// In een latere stap kun je dit weer volledig aan Supabase hangen
interface UserSession {
  email: string;
  isLoggedIn: boolean;
}

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check of er al een actieve sessie in de browser staat
    const savedUser = localStorage.getItem("dynasty_user");
    if (savedUser) {
      setSession(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleGoogleLogin = () => {
    // Dit simuleert de succesvolle Google login voor jouw account
    const userSession = {
      email: "stripboekenkp2@gmail.com",
      isLoggedIn: true,
    };
    localStorage.setItem("dynasty_user", JSON.stringify(userSession));
    setSession(userSession);
  };

  const handleLogout = () => {
    localStorage.removeItem("dynasty_user");
    setSession(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Laden...</p>
      </div>
    );
  }

  // Als de gebruiker NIET is ingelogd, tonen we het inlogscherm
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Dynasty Urenregistratie</h2>
          <p className="mt-2 text-sm text-gray-600">Log in om toegang te krijgen tot je dashboard</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.82z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.32 14.24A7.16 7.16 0 0 1 5 12c0-.79.13-1.57.32-2.34V6.51H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.79 1.21 5.49l4.11-3.25z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.51l4.11 3.25c.94-2.85 3.57-4.96 6.68-4.96z"
                />
              </svg>
              Inloggen met Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === DE HARDCODED ROL CHECK ===
  // We kijken naar het e-mailadres. Ben jij het? Dan ben je ALTijd de employer.
  const isEmployer = session.email === "stripboekenkp2@gmail.com";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigatiebalk */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-xl text-blue-600">Dynasty</span>
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium uppercase">
            {isEmployer ? "Werkgever" : "Werknemer"}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 hidden sm:inline">{session.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
          >
            Uitloggen
          </button>
        </div>
      </nav>

      {/* Dashboard weergave op basis van de hardcoded rol */}
      <main>
        {isEmployer ? <EmployerDashboard /> : <EmployeeDashboard />}
      </main>
    </div>
  );
}