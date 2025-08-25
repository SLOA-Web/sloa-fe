import SectionHeader from "../SectionHeader";
import { BENEFITS } from "@/data";

const Benefits: React.FC = () => {
  return (
    <div className="py-12 lg:py-24">
      <SectionHeader text="benefits" />

      <div className="mx-4 md:mx-10 lg:mx-16 lg:w-[50%] my-12">
        <span className="font-roboto text-[32px] md:text-[40px] lg:text-[55px] basis-[72.5%]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </span>
        <p className="font-poppins text-[16px] 16 lg:mr-24 leading-8 my-4">
          Sri Lanka Orthopaedic Association (SLOA) represents the Orthopaedic
          surgical fraternity of Sri Lanka. SLOA is committed to the improvement
          of the standard of care given to Orthopaedic and Trauma patients.
        </p>
      </div>

      <div className="mx-4 md:mx-10 lg:mx-16 lg:mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {BENEFITS.map((benefit, idx) => (
          <div
            key={idx}
            className="bg-white hover:bg-secondary hover:text-white transition-colors duration-300 rounded-lg shadow p-8 cursor-pointer"
          >
            <h3 className="font-roboto text-[32px] mb-4 mb-52 font-thin">
              {benefit.title}
            </h3>
            <p className="font-poppins text-[16px]">{benefit.para}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;
