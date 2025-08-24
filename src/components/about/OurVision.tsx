import SimpleImage from "@/components/SimpleImage";

interface OurVisionProps {
  title?: string;
  content?: string[];
  imageUrl?: string;
  imageAlt?: string;
}

export default function OurVision({
  title = "Our\nVision",
  content = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  ],
  imageUrl = "/assets/images/our-vision.webp",
  imageAlt = "Medical facility"
}: OurVisionProps) {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
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
              className="w-full h-[300px] lg:h-[492px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
