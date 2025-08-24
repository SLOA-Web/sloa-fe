import { CommonBannerProps } from "@/types";

const CommonBanner: React.FC<CommonBannerProps> = ({ imageUrl, text }) => {
  return (
    <div
      className="w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
      <h1 className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[96px] font-roboto uppercase leading-tight">
        {text}
      </h1>
    </div>
  );
};

export default CommonBanner;