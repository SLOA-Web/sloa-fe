export function formatDeadline(dateStr?: string): string {
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
