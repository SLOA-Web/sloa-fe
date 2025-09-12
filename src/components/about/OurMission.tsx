import SimpleImage from "@/components/SimpleImage";
import SectionHeader from "../SectionHeader";

interface OurMissionProps {
  readonly title?: string;
  readonly content?: readonly string[];
  readonly imageUrl?: string;
  readonly imageAlt?: string;
}

export default function OurMission({
  title = "Our Mission",
  content = [
    "To promote the highest standards in orthopaedic practice through continuous professional development, training, and research.",
    "To foster collaboration among orthopaedic professionals locally and internationally.",
    "To advocate for patient-centered care and improved musculoskeletal health nationwide.",
    "To mentor and support the next generation of orthopaedic surgeons in Sri Lanka.",
  ],
  imageUrl = "/assets/images/our_mission.svg",
  imageAlt = "Physical rehabilitation with forearm crutches",
}: OurMissionProps) {
  return (
    <section className="py-12 lg:py-24 bg-white">
      <SectionHeader text="What Drives Us" className="mb-8 lg:mb-24" />
      <div className="px-4 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Image */}
          <div className="order-1">
            <SimpleImage
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-[300px] md:h-[350px] lg:h-[492px] object-cover rounded-[8px]"
            />
          </div>

          {/* Right Column - Text */}
          <div className="order-2 lg:mb-12">
            <h2 className="text-[#122D1E] font-roboto text-3xl lg:text-5xl xl:text-[55px] leading-tight mb-6 lg:mb-12 font-normal whitespace-pre-line">
              {title}
            </h2>
            <div>
              {content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[#122D1E] font-poppins text-[16px] md:text-[20px] lg:text-[24px] "
                >
                  {paragraph
                    .split("\n")
                    .map((line, i, arr) =>
                      i < arr.length - 1 ? (
                        <span key={i}>
                          {line}
                          <br />{" "}
                        </span>
                      ) : (
                        <span key={i}>{line}</span>
                      )
                    )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
