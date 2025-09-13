import SimpleImage from "@/components/SimpleImage";

interface OurVisionProps {
  readonly title?: string;
  readonly content?: readonly string[];
  readonly imageUrl?: string;
  readonly imageAlt?: string;
}

export default function OurVision({
  title = "Our Vision",
  content = [
    "To be the leading authority in orthopaedic care, education, and research in Sri Lanka, ensuring excellence in musculoskeletal health for all. \n We strive to foster innovation, compassion, and collaboration, empowering both patients and professionals to achieve the highest standards in orthopaedic well-being and advancing the future of musculoskeletal medicine in our nation.",
  ],
  imageUrl = "/assets/images/vision.svg",
  imageAlt = "Medical facility",
}: OurVisionProps) {
  return (
    <section className="py-12 lg:py-24 px-4 md:px-10 lg:px-16">
      <div className="container ">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Left Column - Text */}
          <div className="order-2 lg:order-1 lg:w-1/2 lg:mb-12 lg:pr-12">
            <h2 className="text-[#122D1E] font-roboto text-3xl lg:text-5xl xl:text-[55px] leading-tight mb-6 lg:mb-12 font-normal whitespace-pre-line">
              {title}
            </h2>
            <div className="space-y-6">
              {content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[#122D1E] font-poppins text-sm lg:text-base leading-7 lg:leading-8"
                >
                  {paragraph.split("\n").map((line, i, arr) =>
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

          {/* Right Column - Image */}
          <div className="order-1 lg:order-2 lg:w-1/2 lg:h-full">
            <SimpleImage
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-[300px] md:h-[350px] lg:h-[492px] object-cover rounded-[8px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
