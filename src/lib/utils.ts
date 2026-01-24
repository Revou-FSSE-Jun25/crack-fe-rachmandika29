export function formatToLocal(dateIso: string, time: string): { date: string; time: string; full: string } {
  try {
    // Assume dateIso is YYYY-MM-DD and time is HH:mm in UTC
    // We append Z to treat it as UTC
    const utcString = `${dateIso}T${time}:00Z`;
    const date = new Date(utcString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return { date: dateIso, time, full: `${dateIso} • ${time}` };
    }

    const localDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const localTime = date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

    return {
      date: localDate,
      time: localTime,
      full: `${localDate} • ${localTime}`,
    };
  } catch {
    return { date: dateIso, time, full: `${dateIso} • ${time}` };
  }
}
