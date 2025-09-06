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
      <SectionHeader text="become a member" className="mt-8 lg:mt-0" />
      <div className="flex flex-col lg:flex-row gap-2 lg:items-end justify-between text-left mx-4 md:mx-10 lg:mx-16 my-5 lg:my-10">
        <div className="basis-[72.5%]">
          <span className="font-roboto text-[32px] md:text-[40px] lg:text-[55px] block mb-4">
            Join Sri Lanka&apos;s Leading Orthopaedic Network
          </span>
          <p className="text-[18px] md:text-[20px] lg:text-[24px] leading-relaxed">
            Membership of the Sri Lanka Orthopaedic Association provides access to CPD-accredited courses, clinical guidelines, research opportunities, and a network of local and international experts. Whether you&apos;re a trainee, specialist, or consultant, SLOA supports your career growth and professional development.
          </p>
        </div>
        <div className="basis-[27.5%] flex justify-start mt-4 lg:mt-4 lg:justify-end">
          <CustomButton text="Join now" />
        </div>
      </div>
      
      <CustomImage imageUrl="/assets/images/become_member.svg" />
    </section>
  );
};

export default BecomeAMember;
