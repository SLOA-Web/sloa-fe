import { EventCardProps } from "@/types";

export function parseEventProps(props: EventCardProps) {
  if (props.event) {
    const event = props.event;
    return {
      image: event.coverImage || event.posterUrl || "/assets/images/small_logo.png",
      date: formatEventDate(event.date),
      title: event.title,
      summary: event.description || "",
      doctor: (event.agenda && event.agenda.length > 0 ? event.agenda[0].speaker : "") || "",
    };
  }
  return {
    image: props.image || "/assets/images/small_logo.png",
    date: props.date || "",
    title: props.title || "",
    summary: props.summary || props.shortDesc || "",
    doctor: props.doctor || props.speaker || "",
  };
}

export  function formatEventDate(dateStr: string): string {
  if (!dateStr) return "";
  let dateObj: Date;
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number);
    dateObj = new Date(year, month - 1, day);
  } else {
    dateObj = new Date(dateStr);
  }
  return !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : dateStr;
}