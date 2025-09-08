"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { NAVBAR, TOP_BAR_LINKS } from "@/data/index";
import { useAuth } from "@/context/AuthContext";

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
  const { user, isLoading } = useAuth();
  const navLinksRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
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

  // Accessibility: close on Escape and focus handling when opening
  useEffect(() => {
    if (!hasMounted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        e.preventDefault();
        closeMobileMenu();
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("keydown", onKeyDown);
      // focus first link in drawer after open
      setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 50);
    }
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen, hasMounted]);

  const isActiveLink = (item: NavbarItem) => {
    if (item.children) {
      return item.children.some(
        (child: NavbarChild) => pathname === child.href
      );
    }
    return pathname === item.href;
  };

  // Generate dynamic top bar links based on authentication status
  const getTopBarLinks = () => {
    if (isLoading) {
      // Show loading state
      return TOP_BAR_LINKS.map((link) =>
        link.title === "Log In" ? { ...link, title: "Loading..." } : link
      );
    }

    if (user) {
      // User is authenticated, replace "Log In" with "Profile"
      return TOP_BAR_LINKS.map((link) =>
        link.title === "Log In"
          ? { title: "Profile", href: "/member-portal" }
          : link
      );
    }

    // User is not authenticated, show default links
    return TOP_BAR_LINKS;
  };

  if (!hasMounted) return null;

  // Return null if pathname includes "member-portal"

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
            src="/assets/images/logo.png"
            alt="logo"
            width={400}
            height={160}
            className="relative w-72 lg:w-[28rem] z-[999] mr-16"
            priority
          />
        </Link>

        {!isMobile ? (
          <div
            className="flex flex-col space-x-2 relative w-full"
            ref={navLinksRef}
          >
            {/* Top Light Bar */}
            {!isScrolled && (
              <div className="w-full text-[#122D1E]/50 text-[13px] py-2 px-3 lg:px-6 flex justify-end gap-6 font-light z-[1001] border-b-2 border-gray-300">
                {getTopBarLinks().map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`hover:underline transition-colors ${
                      link.title === "Profile" ? " hover:text-black/80" : ""
                    }`}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              {(NAVBAR as NavbarItem[]).map((item: NavbarItem) => {
                const isActive = isActiveLink(item);
                const isGetInvolved = item.title === "Membership";
                let linkClass = "";
                if (isGetInvolved) {
                  linkClass =
                    "bg-primary text-white px-4 py-2.5 shadow hover:bg-primary/90";
                }
                return (
                  <div key={item.href || item.title} className="flex flex-col items-center mx-2 lg:mx-4  mb-3">
                    <Link
                      href={item.href || "#"}
                      className={`relative pt-1.5 lg:pt-3 inline-block text-[10px] lg:text-[14px] uppercase tracking-wide transition-colors duration-200 ${linkClass}`}
                    >
                      <span
                        className="relative inline-block"
                        style={{ display: "inline-block" }}
                      >
                        {item.title}
                      </span>
                    </Link>
                    {isActive && !isGetInvolved && (
                      <hr className="border-black border-t-2 w-full mt-1 mb-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <button
            onClick={toggleMobileMenu}
            className="relative z-[1000] flex h-10 w-10 items-center justify-center rounded-md border border-transparent hover:border-accent hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-controls="mobile-nav-drawer"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        )}
      </nav>

      {/* Mobile Drawer & Overlay */}
      {isMobile && (
        <>
          {/* Backdrop overlay */}
          <div
            className={`fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
              isMobileMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            aria-hidden="true"
            onClick={closeMobileMenu}
          />

          {/* Drawer */}
          <aside
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            ref={drawerRef}
            className={`fixed top-0 right-0 z-[999] h-full w-full rounded-l-2xl bg-white shadow-xl transition-transform duration-300 ease-out md:hidden flex flex-col ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-3"
              >
                <Image
                  src="/assets/images/logo.png"
                  alt="logo"
                  width={160}
                  height={64}
                  className="h-8 w-auto"
                  priority
                />
                <span className="sr-only">Home</span>
              </Link>
              <button
                onClick={closeMobileMenu}
                className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer content */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <nav className="space-y-1">
                {(NAVBAR as NavbarItem[]).map(
                  (item: NavbarItem, idx: number) => {
                    const isActive = isActiveLink(item);
                    const isCTA = item.title === "Get Involved";
                    if (isCTA) {
                      return (
                        <Link
                          key={getNavKey(item)}
                          href={item.href || "#"}
                          onClick={closeMobileMenu}
                          className="btn btn-primary btn-lg w-full mt-2"
                        >
                          {item.title}
                        </Link>
                      );
                    }
                    return (
                      <Link
                        key={getNavKey(item)}
                        href={item.href || "#"}
                        ref={idx === 0 ? firstLinkRef : undefined}
                        onClick={closeMobileMenu}
                        className={`nav-item ${
                          isActive ? "active" : ""
                        } text-base`}
                      >
                        {item.title}
                      </Link>
                    );
                  }
                )}
              </nav>

              {/* Divider */}
              <div className="my-4 h-px w-full bg-accent" />

              {/* Quick links / top bar on mobile */}
              <div className="grid grid-cols-1 gap-2">
                {getTopBarLinks().map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-accent ${
                      link.title === "Profile"
                        ? "text-primary-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{link.title}</span>
                    <span aria-hidden>→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Drawer footer */}
            <div className="border-t px-4 py-3 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} Sri Lanka Orthopedic Association
            </div>
          </aside>
        </>
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
