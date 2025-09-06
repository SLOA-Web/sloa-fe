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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Loreelit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Loreelit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem \n\n  Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum doelit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorelor sit amet."
  ],
  imageUrl = "/assets/images/our-vision.webp",
  imageAlt = "Medical facility"
}: OurVisionProps) {
  return (
    <section className="py-12 lg:py-24 bg-white px-5 md:px-8 lg:px-14">
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

          {/* Right Column - Image */}
          <div className="order-1 lg:order-2">
            <SimpleImage
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-[595px] lg:h-[492px] object-cover rounded-[8px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
