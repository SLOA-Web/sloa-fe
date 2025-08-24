"use client";

import { useState } from "react";
import Image from "next/image";

interface SimpleImageProps {
  src: string;
  alt: string;
  className: string;
}

const SimpleImage: React.FC<SimpleImageProps> = ({
  src,
  alt,
  className,
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc("/assets/images/member.webp");
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      width={400}
      height={600}
    />
  );
};

export default SimpleImage;
