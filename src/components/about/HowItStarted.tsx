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
  title = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  leftContent = "Sri Lanka Orthopaedic Association (SLOA) represents the Orthopaedic surgical fraternity of Sri Lanka. SLOA is committed to the improvement of the standard of care given to Orthopaedic and Trauma patients. This is done by joining hands with the Ministry of Health to improve the Orthopaedic services of the hospitals and provide optimum care to a wider population. SLOA is also committed to further enhance the knowledge and capabilities of the Sri Lankan Orthopaedic Surgeons by continuous medical education. This is facilitated by the numerous CME programmes in our schedule conducted by national and international resource persons.. es in our schedule conducted by national and.",
  rightContent = "Sri Lanka Orthopaedic Association (SLOA) represents the Orthopaedic surgical fraternity of Sri Lanka. SLOA is committed to the improvement of the standard of care given to Orthopaedic and Trauma patients. This is done by joining hands with the Ministry of Health to improve the Orthopaedic services of the hospitals and provide optimum care to a wider population. SLOA is also committed to further enhance the knowledge and capabilities of the Sri Lankan Orthopaedic Surgeons by continuous medical education. This is facilitated by the numerous CME programmes in our schedule conducted by national and international resource persons.. es in our schedule conducted by national. ",
  heroImageUrl = "/assets/images/how-it-started.svg",
  heroImageAlt = "Medical professionals working",
}: HowItStartedProps) {
  return (
    <section className="relative bg-gradient-to-r from-[#122D1E] via-[#122D1E]/90 to-[#122D1E]/90 py-16 lg:py-24">
      <SectionHeader text="how it started" />
      <div className="container mx-auto">
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
          className="w-full h-[full] md:h-[300px] lg:h-[490px] mx-auto object-cover rounded-[8px]"
        />
      </div>
    </section>
  );
}
