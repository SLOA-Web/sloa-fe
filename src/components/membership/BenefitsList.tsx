"use client"
import React, { useState } from "react";
import SectionHeader from "../SectionHeader";
import { BENEFITS_LIST } from "@/data";

const BenefitsList: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section
      className="py-6 lg:py-16 flex flex-col text-white"
      style={{
        background:
          "linear-gradient(45deg, rgba(18,45,30,0.94) 0%, rgba(18,45,30,0.92) 42%, rgba(18,45,30,1) 100%)",
      }}
    >
      <SectionHeader text="benefits" />
      <div className="mx-4 md:mx-10 lg:mx-16 lg:w-[50%] my-12">
        <span className="font-roboto text-[32px] md:text-[40px] lg:text-[55px] w-[50%]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </span>
      </div>
      <div className="mx-4 md:mx-10 lg:mx-16 flex flex-col md:flex-row items-start gap-10 lg:h-full">
        {/* Image Container - Full Height */}
        <div className="w-full md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
          <div className="w-full h-64 md:h-full md:min-h-[600px] flex items-center justify-center">
            <img
              src={BENEFITS_LIST[activeIdx].image}
              alt={BENEFITS_LIST[activeIdx].title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
        
        {/* Cards Container - Stacked */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="flex flex-col h-[600px] min-h-[400px]">
            {BENEFITS_LIST.map((benefit, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`text-left flex flex-col transition-all duration-300 px-12 border-y border-white/50 cursor-pointer bg-transparent overflow-hidden ${
                  idx === activeIdx
                    ? "shadow-lg flex-grow min-h-[300px] py-6 opacity-100"
                    : "flex-shrink-0 min-h-[56px] max-h-[56px] py-2 opacity-50"
                }`}
                style={{
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                  zIndex: idx === activeIdx ? 1 : 0,
                }}
              >
                <h3 className="font-roboto text-xl lg:text-2xl mb-1 font-semibold">
                  {benefit.title}
                </h3>
                {idx === activeIdx && (
                  <div className="overflow-hidden">
                    <p className="font-poppins text-sm lg:text-base leading-relaxed animate-in slide-in-from-top-2 duration-300">
                      {benefit.para}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsList;