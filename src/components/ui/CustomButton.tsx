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
  variant?: "primary" | "white";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  href,
  onClick,
  className,
  hideIcon,
  variant = "primary",
  type = "button",
  disabled = false,
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

  const baseClasses =
    "group font-roboto capitalize px-6 py-2 border transition-colors duration-200";

  const variantClasses = {
    primary: "border-primary text-primary hover:bg-primary hover:text-white",
    white:
      "border-white text-white hover:bg-primary hover:border-primary hover:text-white",
  };

  const buttonClass = `${baseClasses} ${variantClasses[variant]} ${className}`;

  const content = (
    <span className="flex items-center gap-3">
      {text}
      {!hideIcon && (
        <Image
          src="/assets/images/arrow.svg"
          alt="arrow"
          width={16}
          height={20}
          className={`w-4 h-4 inline-block transition-transform duration-200 group-hover:rotate-45 ${
            variant === "white"
              ? "brightness-0 invert"
              : "group-hover:brightness-0 group-hover:invert"
          }`}
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
    <button onClick={onClick} className={buttonClass} ref={buttonRef} type={type} disabled={disabled}>
      {content}
    </button>
  );
};

export default CustomButton;
