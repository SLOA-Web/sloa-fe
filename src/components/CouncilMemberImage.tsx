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
      : "/assets/images/small_logo.png"
  );

  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc("/assets/images/small_logo.png");
    }
  };

  // If it's an external URL, add unoptimized prop for Next.js Image
  const isExternalUrl = imgSrc.startsWith('http://') || imgSrc.startsWith('https://');

  return (
    <Image
      src={imgSrc}
      alt={alt || "Member image"}
      className={className}
      onError={handleError}
      width={400}
      height={600}
      unoptimized={isExternalUrl} // Allow external URLs to load without optimization
      priority={!isExternalUrl} // Only prioritize local images
    />
  );
};

export default CouncilMemberImage;
