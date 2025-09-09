import { PublicMember } from "@/types";
import CouncilMemberImage from "../CouncilMemberImage";

const MemberCard = ({ member }: { member: PublicMember }) => {
  // Use profile image if available, otherwise fall back to small_logo.png
  const imageSrc = member.profile?.profileImage || "/assets/images/small_logo.png";

  return (
    <div className="group cursor-pointer">
      <div className="flex flex-col space-y-4">
        <div className="relative overflow-hidden rounded-lg bg-gray-100">
          <CouncilMemberImage
            src={imageSrc}
            alt={member.fullName}
            className="w-full h-[300px] object-cover object-center object-top transition-transform duration-300 group-hover:scale-105"
          />
          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#122D1E]/80 via-[#122D1E]/40 to-transparent rounded-b-lg"></div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
        </div>

        <div className="space-y-2">
          <h3 className="text-[#587565] font-poppins text-lg uppercase tracking-wider group-hover:text-primary transition-colors duration-300">
            {member.fullName}
          </h3>
          <p className="text-[#122D1E] font-roboto text-xl group-hover:text-primary/80 transition-colors duration-300">
            {member.profile.specialization}
          </p>
          {member.profile.hospital && (
            <p className="text-[#587565] font-poppins text-sm">
              {member.profile.hospital}
            </p>
          )}
          <p className="text-[#587565] font-poppins text-sm capitalize">
            {member.membershipType}
          </p>
          <p className="text-gray-400 group-hover:text-gray-500 text-sm transition-colors duration-300">
            ID: {member.membershipId}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
