"use client";
import React from "react";
import CustomButton from "../ui/CustomButton";
import SectionHeader from "../SectionHeader";
import CustomImage from "../CustomImage";

const BecomeAMember = () => {
  return (
    <section
      className="pt-6 lg:pt-12 text-center flex flex-col text-white"
      style={{
        background:
          "linear-gradient(45deg, rgba(18,45,30,0.94) 0%, rgba(18,45,30,0.92) 42%, rgba(18,45,30,1) 100%)",
      }}
    >
      <SectionHeader text="become a member" />
      <div className="flex flex-col lg:flex-row gap-2 lg:items-end justify-between text-left mx-4 md:mx-10 lg:mx-16 my-10">
        <span className="font-roboto text-[32px] md:text-[40px] lg:text-[55px]  basis-[72.5%]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum
          dolor sit amet, consectetur adipiscing elit.
        </span>
        <div className="basis-[27.5%] flex justify-start mt-4 lg:mt-4 lg:justify-end">
          <CustomButton text="Join now" />
        </div>
      </div>
      
      <CustomImage imageUrl="/assets/images/become_member.svg" />
    </section>
  );
};

export default BecomeAMember;
