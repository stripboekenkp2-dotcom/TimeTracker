import React, { useState } from "react";

// Structuur voor de urenkaarten van werknemers
interface EmployeeTimeEntry {
  id: string;
  employeeName: string;
  date: string;
  hours: number;
  description: string;
  project: string;
  status: "pending" | "approved" | "rejected";
}

export function EmployerDashboard() {
  // Mock data van je werknemers (dit kun je later weer aan Supabase linken)
  const [entries, setEntries] = useState<EmployeeTimeEntry[]>([
    {
      id: "1",
      employeeName: "Jan Jansen",
      date: "2026-06-12",
      hours: 8,
      project: "Dynasty Website",
      description: "Inlogsysteem gekoppeld en database queries geoptimaliseerd.",
      status: "pending"
    },
    {
      id: "2",
      employeeName: "Anouk de Vries",
      date: "2026-06-12",
      hours: 6.5,
      project: "Marketing Vercel",
      description: "SEO content geschreven en live-gang voorbereid op social media.",
      status: "pending"
    },
    {
      id: "3",
      employeeName: "Jan Jansen",
      date: "2026-06-11",
      hours: 7.5,
      project: "Dynasty Website",
      description: "Design omgezet naar Tailwind CSS componenten.",
      status: "approved"
    }
  ]);

  // Filter status ('all', 'pending', 'approved', 'rejected')
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Functie om uren goed te keuren
  const handleApprove = (id: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, status: "approved" } : entry
    ));
  };

  // Functie om uren af te keuren
  const handleReject = (id: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, status: "rejected" } : entry
    ));
  };

  // Berekeningen voor de statistieken kaarten bovenin
  const totalEmployees = new Set(entries.map(e => e.employeeName)).size;
  const pendingHours = entries.filter(e => e.status === "pending").reduce((acc, curr) => acc + curr.hours, 0);
  const approvedHoursThisMonth = entries.filter(e => e.status === "approved").reduce((acc, curr) => acc + curr.hours, 0);

  // Gefilterde urenlijst voor de tabel
  const filteredEntries = entries.filter(entry => {
    if (statusFilter === "all") return true;
    return entry.status === statusFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Werkgever Controlepaneel</h1>
          <p className="text-gray-500 mt-1">Beheer medewerkers, controleer ingediende uren en keur declaraties goed.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => alert("Exporteren naar Excel/CSV...")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            Exporteer Uren
          </button>
        </div>
      </div>

      {/* Live Statistieken Kaarten */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Actieve Medewerkers</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalEmployees}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-xl font-bold">👥</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Uren in Afwachting</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">{pendingHours} uur</p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl text-xl font-bold">⏳</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Goedgekeurd deze Maand</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{approvedHoursThisMonth} uur</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl text-xl font-bold">✅</div>
        </div>
      </div>

      {/* Hoofdsectie: Filters & Urenoverzicht Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Tabel Header + Interactieve Filters */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <h2 className="text-lg font-bold text-gray-900">Ingezonden Urenkaarten</h2>
          <div className="flex bg-gray-100 p-1 rounded-lg space-x-1 text-sm">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-md font-medium transition ${statusFilter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              Alles ({entries.length})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-md font-medium transition ${statusFilter === "pending" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-orange-600"}`}
            >
              In afwachting ({entries.filter(e => e.status === "pending").length})
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-3 py-1.5 rounded-md font-medium transition ${statusFilter === "approved" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-green-600"}`}
            >
              Goedgekeurd
            </button>
          </div>
        </div>

        {/* De Urentabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100 tracking-wider">
                <th className="p-4">Medewerker</th>
                <th className="p-4">Datum</th>
                <th className="p-4">Project</th>
                <th className="p-4">Uren</th>
                <th className="p-4 max-w-xs">Omschrijving</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400 font-medium">
                    Geen uren gevonden voor dit filter.
                  </td>
                </tr>
              ) : (
                filtered