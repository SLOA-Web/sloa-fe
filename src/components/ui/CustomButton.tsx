"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CustomButtonProps {
  text?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  hideIcon?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  href,
  onClick,
  className,
  hideIcon,
}) => {
  const buttonRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: buttonRef.current,
            start: "top 90%",
          },
        }
      );
    }
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const buttonClass = `group font-roboto capitalize px-6 py-2 border border-primary text-primary transition-colors duration-200  hover:bg-primary hover:text-white ${className}`;

  const content = (
    <span className="flex items-center gap-3">
      {text}
      {!hideIcon && (
        <Image
          src="/assets/images/arrow.svg"
          alt="arrow"
          width={16}
          height={20}
          className="w-4 h-4 inline-block transition-transform duration-200 group-hover:rotate-45 group-hover:invert group-hover:brightness-0"
          priority
        />
      )}
    </span>
  );

  if (href) {
    return (
      <a href={href} className={buttonClass} onClick={onClick} ref={buttonRef}>
        {content}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={buttonClass} ref={buttonRef}>
      {content}
    </button>
  );
};

export default CustomButton;
