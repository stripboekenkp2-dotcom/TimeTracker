import React, { useState } from "react";

interface TimeEntry {
  id: string;
  date: string;
  hours: number;
  description: string;
  status: "pending" | "approved" | "rejected";
}

export default function EmployeeDashboard() {
  // State voor het formulier
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  
  // Tijdelijke mock data voor de tabel (later te koppelen aan Supabase)
  const [entries, setEntries] = useState<TimeEntry[]>([
    {
      id: "1",
      date: "2026-06-12",
      hours: 8,
      description: "Frontend layout opgebouwd en Google OAuth gekoppeld.",
      status: "pending"
    },
    {
      id: "2",
      date: "2026-06-11",
      hours: 7.5,
      description: "Database tabellen aangemaakt en RLS policies ingesteld.",
      status: "approved"
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hours || !description) return;

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      date,
      hours: parseFloat(hours),
      description,
      status: "pending"
    };

    setEntries([newEntry, ...entries]);
    setHours("");
    setDescription("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Werknemer Dashboard</h1>
        <p className="text-gray-600 mt-1">Welkom! Dien hier je gewerkte uren in en bekijk je status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom 1: Uren Registreren Formulier */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Uren Registreren</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aantal uren</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                placeholder="Bijv. 8 of 7.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Werkzaamheden</label>
              <textarea
                rows={3}
                placeholder="Wat heb je gedaan?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Uren Indienen
            </button>
          </form>
        </div>

        {/* Kolom 2 & 3: Mijn Ingezonden Uren Tabel */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Mijn Geschiedenis</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-medium border-b border-gray-100">
                  <th className="p-4">Datum</th>
                  <th className="p-4">Uren</th>
                  <th className="p-4">Omschrijving</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-medium whitespace-nowrap">{entry.date}</td>
                    <td className="p-4 font-semibold text-gray-900">{entry.hours} u</td>
                    <td className="p-4 text-gray-500 max-w-xs truncate">{entry.description}</td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : entry.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {entry.status === "approved" && "Goedgekeurd"}
                        {entry.status === "rejected" && "Afgekeurd"}
                        {entry.status === "pending" && "In afwachting"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}