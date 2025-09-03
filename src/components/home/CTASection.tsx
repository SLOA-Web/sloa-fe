"use client";
import CustomButton from "../ui/CustomButton";
import Image from "next/image";
import { CTASectionProps } from "@/types";
import SectionHeader from "../SectionHeader";

const CTASection: React.FC<CTASectionProps> = ({
  title = "cta head",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et sapien non nunc blandit ullamcorper.",
  buttonText = "Join Now",
  onClick,
}) => {
  return (
    <section className="w-full flex flex-col items-start justify-center py-16 shadow-lg relative overflow-hidden min-h-[600px] bg-gradient-to-r from-[#0d1f14] via-[#0d1f14] to-transparent to-[95%]">
      <Image
        src="/assets/images/cta.svg"
        alt="CTA Background"
        fill
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
        aria-hidden="true"
        priority
      />

      <SectionHeader text={title} />
      <div className="relative z-10 flex flex-col items-start mx-4 md:mx-10 lg:mx-16">
        <p className="text-[32px] md:text-[40px] lg:text-[55px] my-12 text-white mb-8 text-left lg:w-[40%] font-roboto leading-[55px]">
          {description}
        </p>
        <CustomButton
          text={buttonText}
          onClick={onClick}
          variant="white"
          className="px-8 py-3 text-lg font-semibold mt-8"
        />
      </div>
    </section>
  );
};

export default CTASection;
