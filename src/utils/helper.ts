export function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  
  // Parse date safely to avoid timezone issues
  // If the date is in YYYY-MM-DD format, parse it as UTC
  const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
  let d: Date;
  
  if (dateOnlyRegex.test(dateStr)) {
    // Parse as UTC date to avoid timezone shifts
    const [year, month, day] = dateStr.split('-').map(Number);
    d = new Date(Date.UTC(year, month - 1, day));
  } else {
    d = new Date(dateStr);
  }
  
  return !isNaN(d.getTime())
    ? d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
      })
    : dateStr;
}

// Format date range for events (single-day or multi-day)
// Returns "DD MMM YYYY" for single day or "DD MMM - DD MMM YYYY" for multi-day events
export function formatDateRange(startDate?: string, endDate?: string | null): string {
  if (!startDate) return "-";
  
  // Helper function to parse date safely
  const parseDate = (dateStr: string): Date => {
    const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateOnlyRegex.test(dateStr)) {
      // Parse as UTC date to avoid timezone shifts
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    }
    return new Date(dateStr);
  };
  
  const start = parseDate(startDate);
  if (isNaN(start.getTime())) return startDate;
  
  // If no end date or end date is invalid, return single date
  if (!endDate) {
    return start.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
  }
  
  const end = parseDate(endDate);
  if (isNaN(end.getTime())) {
    return start.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
  }
  
  // If start and end are the same day, return single date
  if (start.toUTCString() === end.toUTCString() || 
      (start.getUTCFullYear() === end.getUTCFullYear() && 
       start.getUTCMonth() === end.getUTCMonth() && 
       start.getUTCDate() === end.getUTCDate())) {
    return start.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
  }
  
  // Format multi-day event using UTC to avoid timezone shifts
  const startDay = start.toLocaleDateString("en-GB", { day: "2-digit", timeZone: "UTC" });
  const startMonth = start.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
  const startYear = start.getUTCFullYear();
  
  const endDay = end.toLocaleDateString("en-GB", { day: "2-digit", timeZone: "UTC" });
  const endMonth = end.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
  const endYear = end.getUTCFullYear();
  
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
  
  // If time is in HH:MM or HH:MM:SS format (without timezone), return as-is or format it
  const timeOnlyRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
  const timeMatch = timeOnlyRegex.exec(time);
  
  if (timeMatch) {
    // It's a simple time string like "08:00" or "13:30"
    const hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2];
    
    // Convert to 12-hour format with AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours.toString().padStart(2, '0')}:${minutes} ${period}`;
  }
  
  // If it's already in "HH:MM AM/PM" format, return as-is
  const amPmRegex = /^\d{1,2}:\d{2}\s*(AM|PM)$/i;
  if (amPmRegex.test(time)) {
    return time;
  }
  
  // If it's an ISO datetime string, parse it without timezone conversion
  // by extracting just the time portion
  if (time.includes('T') || time.includes('Z')) {
    const d = new Date(time);
    if (!isNaN(d.getTime())) {
      // Extract time in UTC to avoid timezone shifts
      const hours = d.getUTCHours();
      const minutes = d.getUTCMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  }
  
  return time;
}