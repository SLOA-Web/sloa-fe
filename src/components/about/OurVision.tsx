import SimpleImage from "@/components/SimpleImage";

interface OurVisionProps {
  readonly title?: string;
  readonly content?: readonly string[];
  readonly imageUrl?: string;
  readonly imageAlt?: string;
}

export default function OurVision({
  title = "Our\nVision",
  content = [
    "A Sri Lanka where every patient has access to world-class orthopaedic care — delivered by skilled, ethical professionals working within a collaborative, research-driven system."
  ],
  imageUrl = "/assets/images/our-vision.webp",
  imageAlt = "Medical facility"
}: OurVisionProps) {
  return (
    <section className="py-12 lg:py-24 bg-white mx-5 md:mx-10 lg:mx-16">
      <div className="container ">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Text */}
          <div className="order-2 lg:order-1">
            <h2 className="text-[#122D1E] font-roboto text-3xl lg:text-5xl xl:text-[55px] leading-tight mb-8 font-normal whitespace-pre-line">
              {title}
            </h2>
            <div className="space-y-6">
              {content.map((paragraph, index) => (
                <p key={index} className="text-[#122D1E] font-poppins text-base leading-7">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="order-1 lg:order-2">
            <SimpleImage
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-[300px] lg:h-[492px] object-cover rounded-[8px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
