"use client";

import { useState } from "react";

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
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc("https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=600&fit=crop&crop=face");
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

export default CouncilMemberImage;
