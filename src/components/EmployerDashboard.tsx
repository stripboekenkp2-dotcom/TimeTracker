import React from "react";

export default function EmployerDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Werkgever Dashboard</h1>
        <p className="text-gray-600 mt-1">Welkom terug! Hier is het overzicht van de Dynasty Urenregistratie.</p>
      </div>

      {/* Statistieken Kaarten */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Totaal Aantal Werknemers</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Te Goedkeuren Uren</h3>
          <p className="text-2xl font-semibold text-orange-600 mt-2">0 uur</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Goedgekeurd deze maand</h3>
          <p className="text-2xl font-semibold text-green-600 mt-2">0 uur</p>
        </div>
      </div>

      {/* Urenoverzicht Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Ingezonden Uren (Werknemers)</h2>
        </div>
        <div className="p-6 text-center text-gray-500">
          <p>Er zijn momenteel geen uren ingezonden om te controleren.</p>
        </div>
      </div>
    </div>
  );
}