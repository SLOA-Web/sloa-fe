"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import logo from "../../public/assets/images/logo.png";
import { NAVBAR, TOP_BAR_LINKS } from "@/data/index";

// Type definitions
interface NavbarChild {
  title: string;
  href: string;
}

interface NavbarItem {
  title: string;
  href?: string;
  children?: NavbarChild[];
}

const Navbar = () => {
  const pathname = usePathname();
  const navLinksRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  // Removed isHeaderHidden logic
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const prevPathRef = useRef(pathname);

  // Removed lastScrollY and scrollThreshold

  useEffect(() => {
    const checkMobileScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobileScreen();
    window.addEventListener("resize", checkMobileScreen);
    return () => window.removeEventListener("resize", checkMobileScreen);
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    let ticking = false;
    let lastIsScrolled = isScrolled;

    const update = () => {
      const nextIsScrolled = window.scrollY > 200;
      if (nextIsScrolled !== lastIsScrolled) {
        lastIsScrolled = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // Initialize on mount
    update();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMounted, isScrolled]);

  useEffect(() => {
    if (!navLinksRef.current || !hasMounted) return;
    gsap.fromTo(
      navLinksRef.current.children,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, [hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;
    if (prevPathRef.current !== pathname) {
      if (isMobileMenuOpen) {
        closeMobileMenu();
      }
      // removed: setMobileDropdownOpen(null);
      prevPathRef.current = pathname;
    }
  }, [pathname, hasMounted, isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    // removed: setMobileDropdownOpen(null);
    document.body.classList.remove("overflow-hidden");
  };

  const toggleMobileMenu = useCallback(() => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      setIsMobileMenuOpen(true);
      document.body.classList.add("overflow-hidden");
    }
  }, [isMobileMenuOpen]);

  const isActiveLink = (item: NavbarItem) => {
    if (item.children) {
      return item.children.some(
        (child: NavbarChild) => pathname === child.href
      );
    }
    return pathname === item.href;
  };

  if (!hasMounted) return null;

  // Return null if pathname includes "member-portal"
  if (pathname?.includes("member-portal")) return null;

  // Helper for mobile nav keys
  const getNavKey = (item: NavbarItem) => item.href || item.title;

  return (
    <>
      {/* Main Header */}
      <nav
        ref={headerRef}
        className={`fixed w-full font-roboto px-3 lg:px-6 max-w-[1560px] mx-auto font-lato py-2 flex items-center justify-between left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out z-[999] ${
          isMobileMenuOpen || isScrolled
            ? "bg-white shadow"
            : "bg-gradient-to-b from-white via-white/90 to-transparent"
        }`}
      >
        <Link href="/">
          <Image
            src={logo}
            alt="logo"
            className="relative w-24 lg:w-44 z-[999] mr-12"
          />
        </Link>

        {!isMobile ? (
          <div className="flex flex-col space-x-2 relative w-full" ref={navLinksRef}>
            {/* Top Light Bar */}
            {!isScrolled && (
              <div className="w-full text-[#122D1E]/50 text-[13px] py-2 px-3 lg:px-6 flex justify-end gap-6 font-light z-[1001] border-b-2 border-gray-300">
                {TOP_BAR_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:underline"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              {(NAVBAR as NavbarItem[]).map((item: NavbarItem) => {
                const isActive = isActiveLink(item);
                const isGetInvolved = item.title === "Get Involved";
                let linkClass = "";
                if (isGetInvolved) {
                  linkClass = "bg-primary text-white p-4 shadow hover:bg-primary/90";
                } else if (isActive) {
                  linkClass = "border-b-[2px] border-black";
                }
                return (
                    <Link
                    key={item.href || item.title}
                    href={item.href || "#"}
                    className={`relative mx-2 lg:mx-4 pt-2 lg:pt-4 mb-4 inline-block text-[10px] lg:text-[14px] uppercase tracking-wide transition-colors duration-200 ${linkClass}`}
                    >
                    <span
                      className="relative inline-block"
                      style={{ display: "inline-block" }}
                    >
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <button
            onClick={toggleMobileMenu}
            className="text-2xl focus:outline-none z-50"
            style={{ transition: "transform 0.2s" }}
          >
            <span
              style={{
                display: "inline-block",
                transform: isMobileMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </span>
            <span className="sr-only">Toggle menu</span>
          </button>
        )}
      </nav>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-white z-50 md:hidden min-h-screen flex flex-col justify-center"
          id="mobile-menu"
          style={{ opacity: 0 }}
          ref={(el) => {
            if (el) {
              gsap.to(el, { opacity: 1, duration: 0.2, ease: "power2.out" });
            }
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
            <div className="absolute -left-[20%] top-0 w-[140%] h-[140%] " />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-black overflow-y-auto">
            <div className="w-full max-w-md">
              {(NAVBAR as NavbarItem[]).map((item: NavbarItem) => (
                <Link
                  key={getNavKey(item)}
                  href={item.href || "#"}
                  className={`block text-2xl sm:text-3xl font-bold transition-all hover:pl-4 cursor-pointer ${
                    pathname === item.href
                      ? "pl-4 border-l-2 border-primary"
                      : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* Top Bar Links on Mobile */}
            <div className="w-full max-w-md mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-3">
                {TOP_BAR_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-base sm:text-lg text-gray-700 hover:text-black transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>

            <div
              className="absolute bottom-12 left-0 right-0 text-center text-black text-sm px-8"
              style={{ opacity: 0, transform: "translateY(20px)" }}
              ref={(el) => {
                if (el) {
                  gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    delay: 0.4,
                    ease: "power2.out",
                  });
                }
              }}
            >
              <p>© {new Date().getFullYear()} EduSight. All rights reserved.</p>
            </div>
          </div>
        </div>
      )}

      {/* CSS for dropdown animation */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;