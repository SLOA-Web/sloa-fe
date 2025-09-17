"use client";

import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/libs/image";
import type { SanityEvent } from "@/types/sanity";

interface EventCardProps {
  event: SanityEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Date TBA";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const coverImage = event.imageGallery?.[0];

  return (
    <Link
      href={`/news-media/events/${event._id}`}
      className="group block bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:-translate-y-0.5 h-96 flex flex-col"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden ">
        {coverImage ? (
          <Image
            src={urlFor(coverImage).width(400).height(300).url()}
            alt={event.title}
            fill
            className="object-cover object-center object-top group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
        {/* Year badge (guard invalid dates) */}
        {(() => {
          const d = event.eventDate ? new Date(event.eventDate) : null;
          const year =
            d && !isNaN(d.getTime()) ? String(d.getFullYear()) : null;
          return year ? (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-md shadow-primary-500/10 shadow">
              {year}
            </div>
          ) : null;
        })()}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4 flex-shrink-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={16} className="mr-2" />
            {formatDate(event.eventDate)}
          </div>

          {event.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin size={16} className="mr-2" />
              {event.location}
            </div>
          )}
        </div>

        {event.shortDescription && (
          <p className="text-sm line-clamp-3 flex-1">{event.shortDescription}</p>
        )}
      </div>
    </Link>
  );
}
