import SimpleImage from "@/components/SimpleImage";

interface OurMissionProps {
  title?: string;
  content?: string;
  images?: Array<{
    src: string;
    alt: string;
  }>;
}

export default function OurMission({
  title = "Our\nMission",
  content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  images = [
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/5b7e8d14157dbda11d40a1ae174fe38cf7b6a433?width=804",
      alt: "Medical procedure 1"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/ab2e73a8211f22ffccb82fed683dbf7d98b0ecdf?width=804",
      alt: "Medical procedure 2"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/ab2e73a8211f22ffccb82fed683dbf7d98b0ecdf?width=804",
      alt: "Medical procedure 3"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/7210724a32b070ed1d087f4452ed894215a89141?width=804",
      alt: "Medical procedure 4"
    }
  ]
}: OurMissionProps) {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-[#F6E4E5]/50">
      <div className="container mx-auto px-4 lg:px-20">
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-[70px] h-[1px] bg-[#587565]"></div>
          <span className="text-[#587565] font-poppins text-lg uppercase tracking-wider">
            Become a Member
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Text */}
          <div>
            <h2 className="text-[#122D1E] font-roboto text-3xl lg:text-5xl xl:text-[55px] leading-tight mb-8">
              {title}
            </h2>
          </div>

          {/* Right Column - Text */}
          <div>
            <p className="text-[#122D1E] font-poppins text-base leading-7 mb-8 pt-4">
              {content}
            </p>
          </div>
        </div>

        {/* Images Grid with Gradient Overlays */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 relative">
          {/* Left Gradient Overlay */}
          <div className="absolute left-0 top-0 w-32 lg:w-72 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          
          {/* Right Gradient Overlay */}
          <div className="absolute right-0 top-0 w-32 lg:w-72 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {images.map((image, index) => (
            <div 
              key={index} 
              className={`${
                index === 0 ? 'transform -translate-x-12 lg:-translate-x-24' : 
                index === images.length - 1 ? 'transform translate-x-12 lg:translate-x-24' : ''
              }`}
            >
              <SimpleImage
                src={image.src}
                alt={image.alt}
                className="w-full h-[300px] lg:h-[445px] object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
