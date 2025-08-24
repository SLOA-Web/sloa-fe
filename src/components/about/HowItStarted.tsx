import SimpleImage from "@/components/SimpleImage";

interface HowItStartedProps {
  title?: string;
  leftContent?: string;
  rightContent?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
}

export default function HowItStarted({
  title = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  leftContent = "Sri Lanka Orthopaedic Association (SLOA) represents the Orthopaedic surgical fraternity of Sri Lanka. SLOA is committed to the improvement of the standard of care given to Orthopaedic and Trauma patients. This is done by joining hands with the Ministry of Health to improve the Orthopaedic services of the hospitals and provide optimum care to a wider population. SLOA is also committed to further enhance the knowledge and capabilities of the Sri Lankan Orthopaedic Surgeons by continuous medical education. This is facilitated by the numerous CME programmes in our schedule conducted by national and international resource persons.",
  rightContent = "Sri Lanka Orthopaedic Association (SLOA) represents the Orthopaedic surgical fraternity of Sri Lanka. SLOA is committed to the improvement of the standard of care given to Orthopaedic and Trauma patients. This is done by joining hands with the Ministry of Health to improve the Orthopaedic services of the hospitals and provide optimum care to a wider population. SLOA is also committed to further enhance the knowledge and capabilities of the Sri Lankan Orthopaedic Surgeons by continuous medical education. This is facilitated by the numerous CME programmes in our schedule conducted by national and international resource persons.",
  heroImageUrl = "https://api.builder.io/api/v1/image/assets/TEMP/fdd893fc2fa547e97cca62cfeb9fd5b48ffca56f?width=2560",
  heroImageAlt = "Medical professionals working"
}: HowItStartedProps) {
  return (
    <section className="relative bg-gradient-to-r from-[#122D1E] via-[#122D1E]/90 to-[#122D1E]/80 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-[70px] h-[1px] bg-[#587565]"></div>
          <span className="text-[#587565] font-poppins text-lg uppercase tracking-wider">
            How it started
          </span>
        </div>

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

        {/* Hero Image */}
        <div>
          <SimpleImage
            src={heroImageUrl}
            alt={heroImageAlt}
            className="w-full h-[300px] lg:h-[484px] object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
