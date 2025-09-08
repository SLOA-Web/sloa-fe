"use client";

import { useState } from "react";
import Image from "next/image";

interface CouncilMemberImageProps {
  src: string;
  alt: string;
  className: string;
}

const CouncilMemberImage: React.FC<CouncilMemberImageProps> = ({
  src,
  alt,
  className,
}) => {
  const [imgSrc, setImgSrc] = useState(
    typeof src === "string" && src.trim().length > 0
      ? src
      : "/assets/images/member.webp"
  );

  const handleError = () => {
    setImgSrc("/assets/images/member.webp");
  };

  return (
    <Image
      src={imgSrc}
      alt={alt || "Member image"}
      className={className}
      onError={handleError}
      width={400}
      height={600}
    />
  );
};

export default CouncilMemberImage;
