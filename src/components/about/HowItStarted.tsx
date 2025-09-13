import CustomImage from "@/components/CustomImage";
import SectionHeader from "../SectionHeader";

interface HowItStartedProps {
  readonly title?: string;
  readonly leftContent?: string;
  readonly rightContent?: string;
  readonly heroImageUrl?: string;
  readonly heroImageAlt?: string;
}

export default function HowItStarted({
  title = "Advancing Orthopaedic Care and Training in Sri Lanka.",
  leftContent = "The Sri Lanka Orthopaedic Association (SLOA) is the leading professional body representing orthopaedic surgeons in Sri Lanka. Dedicated to advancing orthopaedic care, trauma management, and musculoskeletal health, the Association also plays a key role in supporting the professional growth of consultants, trainees, and allied health professionals. SLOA actively strengthens the orthopaedic community through Continuing Medical Education (CME) programmes, structured training, hands-on skill sessions, and cadaveric workshops. The Association also conducts seminars and specialized workshops for nurses, physiotherapists, occupational therapists, orthotists, and prosthetists, fostering multidisciplinary collaboration in orthopaedic care.",
  rightContent = "In addition, SLOA works closely with the Ministry of Health, Sri Lanka to enhance orthopaedic services across the country, ensuring equitable access to advanced trauma and orthopaedic care. The Association also maintains strong links with regional and international orthopaedic associations, enabling collaboration, research partnerships, and global knowledge exchange. Through these initiatives, the Sri Lanka Orthopaedic Association continues to lead the way in orthopaedic education, research, and clinical excellence, building a healthier future for Sri Lanka while maintaining recognition within the global orthopaedic community.",
  heroImageUrl = "/assets/images/how-it-started.svg",
}: HowItStartedProps) {
  return (
    <section className="relative bg-gradient-to-r from-[#122D1E] via-[#122D1E]/90 to-[#122D1E]/90 py-16 lg:py-20">
      <SectionHeader text="how it started" />
      <div className="container mx-auto">
        <div className="px-4 md:px-10 lg:px-16 my-12">
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

          {/* Hero Image - now full width */}
          <CustomImage
            imageUrl={heroImageUrl}
            imageClassname="w-full h-[full] md:h-[300px] lg:h-[490px] mx-auto object-cover rounded-[8px]"
          />
        </div>
      </div>
    </section>
  );
}
