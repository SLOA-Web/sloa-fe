export function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return !isNaN(d.getTime())
    ? d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : dateStr;
}

// Format event time as HH:mm (e.g., 09:00 AM), fallback to raw string if invalid
export function formatTime(time: string | undefined): string {
  if (!time || time === "1970-01-01T00:00:00.000Z") return "-";
  const d = new Date(time);
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  return time;
}