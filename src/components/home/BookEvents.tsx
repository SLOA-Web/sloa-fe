"use client";
import SectionHeader from "../SectionHeader";
import Image from "next/image";
import CustomButton from "../ui/CustomButton";
import { bookEventData } from "@/data";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BookEvents: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLLIElement | null)[]>([]);
  const imageAsideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      // Animate heading
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { autoAlpha: 0, y: 80 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Animate cards after heading
      if (cardsRef.current.length) {
        gsap.fromTo(
          cardsRef.current,
          { autoAlpha: 0, y: 60 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.18,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
            delay: 0.2,
          }
        );
      }

      // Animate image aside from right to left
      if (imageAsideRef.current) {
        gsap.fromTo(
          imageAsideRef.current,
          { autoAlpha: 0, x: 120 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
            delay: 0.4,
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="min-h-screen py-12 lg:py-24" ref={sectionRef}>
      <header>
        <SectionHeader text="Become a member" />
      </header>
      <main className="mx-4 md:mx-10 lg:mx-16">
        <h1
          ref={headingRef}
          className="text-[32px] md:text-[40px] lg:text-[55px] lg:w-[50%] font-roboto"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h1>
        <div className="flex flex-col-reverse lg:flex-row w-full mt-8">
          <section className="lg:w-[55%] p-6 rounded-lg mr-4">
            <ul className="flex flex-col gap-8">
              {bookEventData.map((event, idx) => (
                <li
                  key={event.id}
                  ref={(el) => {
                    cardsRef.current[idx] = el;
                  }}
                  className="flex flex-col lg:flex-row items-center bg-white rounded-lg shadow-custom p-4 gap-4"
                >
                  <aside className="flex items-center justify-center h-full mr-2 w-36 ">
                    <div
                      className="flex flex-col items-center justify-center text-[32px] text-white font-semibold rounded px-4 py-2 pb-3 w-full"
                      style={{
                        backgroundColor: event.dateBg
                          .replace("bg-[", "")
                          .replace("]", ""),
                      }}
                    >
                      <time dateTime={event.month} className="text-center">
                        <div>{event.date}</div>
                        <div>{event.month}</div>
                      </time>
                    </div>
                  </aside>
                  <article className="flex flex-1 flex-col lg:flex-row min-w-0 justify-between items-center gap-4">
                    <div className="flex flex-col min-w-0">
                      <p className="text-[24px] font-roboto">{event.title}</p>
                      <p className="text-[16px] font-thin font-poppins text-[#39604B] mb-4">
                        by {event.by}
                      </p>
                      <p className="text-[12px] font-poppins mb-3">
                        {event.description}
                      </p>
                    </div>
                    <div className="w-full lg:w-44 flex-shrink-0">
                      <CustomButton text={event.cta} />
                    </div>
                  </article>
                </li>
              ))}
              <CustomButton
                text="view more events"
                className="w-fit mx-auto my-12"
              />
            </ul>
          </section>
          <aside
            className="lg:w-[45%] rounded-[8px] relative min-h-[300px]"
            ref={imageAsideRef}
          >
            <Image
              src="/assets/images/book_events.svg"
              alt="Book Events"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-contain"
            />
          </aside>
        </div>
      </main>
    </section>
  );
};

export default BookEvents;
