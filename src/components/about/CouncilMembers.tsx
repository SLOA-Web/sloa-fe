import CouncilMemberImage from "@/components/CouncilMemberImage";

interface CouncilMember {
  name: string;
  position: string;
  specialization?: string;
  image: string;
}

interface CouncilMembersProps {
  members?: CouncilMember[];
  title?: string;
}

export default function CouncilMembers({
  members = [
    {
      name: "Dr. Samantha Fernando",
      position: "President",
      specialization: "Spine Surgery",
      image: "/assets/images/member.webp"
    },
    {
      name: "Dr. Rajesh Perera",
      position: "Vice President",
      specialization: "Joint Replacement",
      image: "/assets/images/member.webp"
    },
    {
      name: "Dr. Nimal Silva",
      position: "Secretary",
      specialization: "Trauma Surgery",
      image: "/assets/images/member.webp"
    },
    {
      name: "Dr. Priya Jayawardene",
      position: "Treasurer",
      specialization: "Pediatric Orthopedics",
      image: "/assets/images/member.webp"
    },
    {
      name: "Dr. Kamal Wijesinghe",
      position: "Council Member",
      specialization: "Sports Medicine",
      image: "/assets/images/member.webp"
    },
    {
      name: "Dr. Deepika Rathnayake",
      position: "Council Member",
      specialization: "Hand Surgery",
      image: "/assets/images/member.webp"
    }
  ],
  title = "Council members"
}: CouncilMembersProps) {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-[#F6E4E5]/30">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-[70px] h-[1px] bg-[#587565]"></div>
          <span className="text-[#587565] font-poppins text-lg uppercase tracking-wider">
            {title}
          </span>
        </div>

        {/* Council Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {members.map((member, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="flex flex-col space-y-6">
                <div className="relative overflow-hidden rounded-lg bg-gray-100">
                  <CouncilMemberImage
                    src={member.image}
                    alt={member.name}
                    className="w-full h-[300px] lg:h-[405px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#122D1E]/80 via-[#122D1E]/40 to-transparent rounded-b-lg"></div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[#587565] font-poppins text-lg uppercase tracking-wider group-hover:text-primary transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-[#122D1E] font-roboto text-xl group-hover:text-primary/80 transition-colors duration-300">
                    {member.position}
                  </p>
                  {member.specialization && (
                    <p className="text-[#587565] font-poppins text-sm">
                      {member.specialization}
                    </p>
                  )}
                </div>

                <div className="w-full h-[1px] bg-primary/25 group-hover:bg-primary/50 transition-colors duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
