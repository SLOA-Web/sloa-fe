import { CommonBannerProps } from "@/types";

const CommonBanner: React.FC<CommonBannerProps> = ({ imageUrl, text }) => {
  return (
    <div
      className="w-full min-h-[700px] bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
      <h1 className="absolute bottom-8 right-8 text-white text-[96px] font-roboto uppercase">
        {text}
      </h1>
    </div>
  );
};

export default CommonBanner;