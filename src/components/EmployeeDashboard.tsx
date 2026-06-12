// Voorbeeld van de afrondingslogica in de inklok-functie:
const handleClockIn = () => {
  const now = new Date();
  // Rond naar beneden af op 5 minuten
  const minutes = now.getMinutes();
  const roundedMinutes = Math.floor(minutes / 5) * 5;
  now.setMinutes(roundedMinutes);
  now.setSeconds(0);
  
  const formattedTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
  // Sla formattedTime op in Supabase time_logs...
};

const handleClockOut = () => {
  const now = new Date();
  // Rond naar boven af op 5 minuten
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 5) * 5;
  now.setMinutes(roundedMinutes);
  now.setSeconds(0);
  
  const formattedTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
  // Update de huidige rij in Supabase time_logs...
};