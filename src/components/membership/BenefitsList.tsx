"use client";

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
                className={`text-left flex flex-col transition-all duration-300 px-8 border-y border-white/50 cursor-pointer bg-transparent overflow-hidden ${
                  idx === activeIdx
                    ? "flex-grow min-h-[300px] py-6 opacity-100"
                    : "flex-shrink-0 py-2 opacity-25"
                }`}
                style={{
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                  zIndex: idx === activeIdx ? 1 : 0,
                }}
              >
                {idx === activeIdx ? (
                  <div className="flex flex-col h-full">
                    <div className="flex gap-8 py-8">
                      <div className="inline-block w-3 h-3 aspect-square rounded-full mr-3 bg-[#D47045] mt-3" />

                      <div className="overflow-hidden">
                        <h3 className="font-roboto text-[32px] font-normal">
                          {benefit.title}
                        </h3>
                        <p className="font-poppins text-[16px] opacity-75 py-4 leading-relaxed font-thin animate-in slide-in-from-top-2 duration-300">
                          {benefit.para}
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto -mb-4 pt-4 flex">
                      <span className="font-roboto text-[12px] lg:text-[16px] px-12 uppercase">
                        Benefit {idx + 1}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="font-roboto text-[12px] lg:text-[16px] px-12 uppercase">
                    Benefit {idx + 1}
                  </span>
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