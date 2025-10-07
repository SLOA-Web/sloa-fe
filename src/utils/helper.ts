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

// Format date range for events (single-day or multi-day)
// Returns "DD MMM YYYY" for single day or "DD MMM - DD MMM YYYY" for multi-day events
export function formatDateRange(startDate?: string, endDate?: string | null): string {
  if (!startDate) return "-";
  
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return startDate;
  
  // If no end date or end date is invalid, return single date
  if (!endDate) {
    return start.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  
  const end = new Date(endDate);
  if (isNaN(end.getTime())) {
    return start.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  
  // If start and end are the same day, return single date
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  
  // Format multi-day event
  const startDay = start.toLocaleDateString("en-GB", { day: "2-digit" });
  const startMonth = start.toLocaleDateString("en-GB", { month: "short" });
  const startYear = start.getFullYear();
  
  const endDay = end.toLocaleDateString("en-GB", { day: "2-digit" });
  const endMonth = end.toLocaleDateString("en-GB", { month: "short" });
  const endYear = end.getFullYear();
  
  // Same month and year: "DD - DD MMM YYYY"
  if (startMonth === endMonth && startYear === endYear) {
    return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
  }
  
  // Same year, different month: "DD MMM - DD MMM YYYY"
  if (startYear === endYear) {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
  }
  
  // Different year: "DD MMM YYYY - DD MMM YYYY"
  return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
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