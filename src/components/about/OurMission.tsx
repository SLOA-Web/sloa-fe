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
    "To advance orthopaedic practice in Sri Lanka by providing high-quality education and CPD, enabling research and audit, setting and promoting clinical standards, and advocating for patient safety and musculoskeletal health nationwide. We strive to foster a culture of continuous professional development among orthopaedic practitioners, support innovative research that addresses local and global challenges, and collaborate with healthcare partners to improve patient outcomes. Through our commitment to excellence, we aim to empower clinicians, enhance public awareness, and ensure equitable access to the highest standards of musculoskeletal care throughout the country.",
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
          <div className="order-2">
            <h2 className="text-[#122D1E] font-roboto text-3xl lg:text-5xl xl:text-[55px] leading-tight mb-8 font-normal whitespace-pre-line">
              {title}
            </h2>
            <div className="space-y-6">
              {content.map((paragraph, index) => (
                <p key={index} className="text-[#122D1E] font-poppins text-base leading-7">
                  {paragraph
                    .split('\n')
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
