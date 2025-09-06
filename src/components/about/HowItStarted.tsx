import SimpleImage from "@/components/SimpleImage";
import SectionHeader from "../SectionHeader";

interface HowItStartedProps {
  readonly title?: string;
  readonly leftContent?: string;
  readonly rightContent?: string;
  readonly heroImageUrl?: string;
  readonly heroImageAlt?: string;
}

export default function HowItStarted({
  title = "Raising the standard of orthopaedic care across Sri Lanka.",
  leftContent = "The Sri Lanka Orthopaedic Association (SLOA) is the professional body for orthopaedic surgeons and musculoskeletal specialists in Sri Lanka. From training the next generation to supporting research and quality improvement, we exist to advance safe, effective and compassionate orthopaedic care.",
  rightContent = "Through national courses, conferences and international partnerships, SLOA promotes evidence-based practice and continuous professional development. Our community shares knowledge, mentors trainees and collaborates on guidelines that improve outcomes for trauma and elective orthopaedic patients.",
  heroImageUrl = "/assets/images/how-it-started.webp",
  heroImageAlt = "Medical professionals working",
}: HowItStartedProps) {
  return (
    <section className="relative bg-gradient-to-r from-[#122D1E] via-[#122D1E]/90 to-[#122D1E]/80 py-16 lg:py-24">
      <div className="container mx-auto">
        <SectionHeader text="how it started" />

        <div className="mx-4 md:mx-10 lg:mx-16 my-12">
          {/* Main Title - spans full width */}
          <div className="mb-12">
            <h1 className="text-white font-roboto text-3xl lg:text-5xl xl:text-[55px] leading-tight max-w-4xl">
              {title}
            </h1>
          </div>

          {/* Two Column Text Layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
            {/* Left Column */}
            <div>
              <p className="text-white font-poppins text-sm lg:text-base leading-7 lg:leading-8">
                {leftContent}
              </p>
            </div>

            {/* Right Column */}
            <div>
              <p className="text-white font-poppins text-sm lg:text-base leading-7 lg:leading-8">
                {rightContent}
              </p>
            </div>
          </div>
        </div>

        {/* Hero Image - now full width */}
        <SimpleImage
          src={heroImageUrl}
          alt={heroImageAlt}
          className="w-full h-[300px] lg:h-[484px] object-cover rounded-[8px]"
        />
      </div>
    </section>
  );
}
