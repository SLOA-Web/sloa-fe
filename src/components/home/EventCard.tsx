import { EventCardProp } from "@/types";
import Image from "next/image";
import CustomButton from "../ui/CustomButton";

interface EventCardPropsWithState extends EventCardProp {
  state?: string;
}

const EventCard: React.FC<EventCardPropsWithState> = ({
  image,
  date,
  title,
  summary,
  doctor,
  onReadMore,
  state,
}) => {
  if (state === "upcoming") {
    return (
      <div className="bg-white overflow-hidden shadow-sm flex flex-col items-center w-full max-w-xs text-black">
        {/* Top half image */}
        <div className="w-full h-52 relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        {/* Content */}
        <div className="p-4 flex flex-col w-full">
          <h3 className="text-[16px] mb-2 font-roboto">{title}</h3>
          <p className="text-[14px] mb-2 font-poppins font-thin">
            {date} | {doctor}
          </p>
          <div className="flex justify-end">
            <CustomButton text="Book Now" className="border-none px-0 py-0" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow-sm flex flex-col items-center w-full max-w-xs">
      {/* Top half image */}
      <div className="w-full h-40 relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      {/* Content */}
      <div className="p-3 lg:p-6 flex flex-col">
        <span className="text-[12px] text-[#39604B] font-bold mb-1 font-poppins">
          {date}
        </span>
        <h3 className="text-[24px] font-normal my-3 font-roboto">{title}</h3>
        <p className="text-[12px] mb-4 font-poppins">{summary}</p>

        <CustomButton
          onClick={onReadMore}
          text="Read More"
          className="border-none px-0 py-0 w-fit"
        />
      </div>
    </div>
  );
};

export default EventCard;
