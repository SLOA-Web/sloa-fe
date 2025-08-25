import { BookEventData, EventCardProp, HeroSlide } from "@/types";

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    backgroundImage: "/assets/images/homepage_hero.svg",
    title: "Advancing Orthopaedic Excellence Across Sri Lanka",
  },
  {
    id: 2,
    backgroundImage: "/assets/images/about_us.svg",
    title: "Innovative Medical Technology Solutions",
  },
  {
    id: 3,
    backgroundImage: "/assets/images/homepage_hero.svg",
    title: "Expert Surgical Care & Rehabilitation",
  },
  {
    id: 4,
    backgroundImage: "/assets/images/about_us.svg",
    title: "Research & Development in Orthopaedics",
  },
];

export const eventCards: EventCardProp[] = [
  {
    image: "/assets/images/about_us.svg",
    date: "Aug 18, 2025",
    title: "Neglected Trauma Workshop",
    summary:
      "Sri Lanka Orthopaedic Association (SLOA) represents the Orthopaedic surgical fraternity of Sri Lanka. SLOA is committed to the improvement of the standard of care given to Orthopaedic and Trauma patients.",
    doctor: "Dr. Umapathy",
  },
  {
    image: "/assets/images/homepage_hero.svg",
    date: "Sep 10, 2025",
    title: "Neglected Trauma Workshop",
    summary:
      "Sri Lanka Orthopaedic Association (SLOA) represents the Orthopaedic surgical fraternity of Sri Lanka. SLOA is committed to the improvement of the standard of care given to Orthopaedic and Trauma patients.",
    doctor: "Dr. Umapathy",
  },
  {
    image: "/assets/images/about_us.svg",
    date: "Oct 5, 2025",
    title: "Neglected Trauma Workshop",
    summary:
      "Sri Lanka Orthopaedic Association (SLOA) represents the Orthopaedic surgical fraternity of Sri Lanka. SLOA is committed to the improvement of the standard of care given to Orthopaedic and Trauma patients.",
    doctor: "Dr. Umapathy",
  },
  {
    image: "/assets/images/homepage_hero.svg",
    date: "Nov 2, 2025",
    title: "Neglected Trauma Workshop",
    summary:
      "Sri Lanka Orthopaedic Association (SLOA) represents the Orthopaedic surgical fraternity of Sri Lanka. SLOA is committed to the improvement of the standard of care given to Orthopaedic and Trauma patients.",
    doctor: "Dr. Umapathy",
  },
  {
    image: "/assets/images/about_us.svg",
    date: "Aug 18, 2025",
    title: "Neglected Trauma Workshop",
    summary:
      "Sri Lanka Orthopaedic Association (SLOA) represents the Orthopaedic surgical fraternity of Sri Lanka. SLOA is committed to the improvement of the standard of care given to Orthopaedic and Trauma patients.",
    doctor: "Dr. Umapathy",
  },
];

export const BENEFITS_LIST = [
  {
    image: "/assets/images/benefit1.svg",
    title: "Professional Networking",
    para: "Connect with leading orthopaedic professionals and expand your network through exclusive events and forums.",
  },
  {
    image: "/assets/images/homepage_hero.svg",
    title: "Continuous Education",
    para: "Access workshops, seminars, and resources to stay updated with the latest advancements in orthopaedics.",
  },
  {
    image: "/assets/images/benefit1.svg",
    title: "Research Opportunities",
    para: "Participate in collaborative research projects and contribute to the growth of orthopaedic science.",
  },
  {
    image: "/assets/images/homepage_hero.svg",
    title: "Advocacy & Support",
    para: "Benefit from representation and support on professional matters at national and international levels.",
  },
  {
    image: "/assets/images/benefit1.svg",
    title: "Exclusive Resources",
    para: "Gain access to members-only publications, guidelines, and clinical tools to enhance your practice.",
  },
];

export const bookEventData: BookEventData[] = [
  {
    id: "neglected-trauma-workshop-july",
    date: "24 - 25",
    month: "July",
    title: "Neglected Trauma Workshop",
    by: "Dr. Umapathy",
    cta: "Book Now",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et sapien non nunc blandit ullamcorper.",
    dateBg: "bg-[#39604B]",
  },
  {
    id: "advanced-trauma-seminar-august",
    date: "10 - 12",
    month: "July",
    title: "Advanced Trauma Seminar",
    by: "Dr. Smith",
    cta: "Book Now",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    dateBg: "bg-[#587565]",
  },
  {
    id: "trauma-awareness-september",
    date: "05 - 07",
    month: "July",
    title: "Trauma Awareness Session",
    by: "Dr. Lee",
    cta: "Book Now",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    dateBg: "bg-[#122D1E]",
  },
  {
    id: "healing-workshop-october",
    date: "15 - 17",
    month: "July",
    title: "Healing Workshop",
    by: "Dr. Patel",
    cta: "Book Now",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    dateBg: "bg-[#D47045]",
  },
];

export const NAVBAR = [
  { title: "Home", href: "/" },
  { title: "About Us", href: "/about" },
  { title: "Event", href: "/event" },
  { title: "Contact", href: "/contact" },
  { title: "Get Involved", href: "/get-involved" },
];

export const TOP_BAR_LINKS = [
  { title: "Resources", href: "/resources" },
  { title: "News & Media", href: "/news-media" },
  { title: "Member Directory", href: "/member-directory" },
  { title: "Log In", href: "/login" },
];

export const DOCUMENTATION_LINKS = [
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms and Condition", href: "/terms-and-condition" },
  { title: "Copyright", href: "/copyright" },
];

export const BENEFITS = [
  {
    title: "Startup Pack",
    para: "For new businesses. Includes Name Reservation, Company Incorporation, and a Digital Articles of Association.Company Incorporation, and a Digital Articles of Association.",
  },
  {
    title: "Growth Package",
    para: "Designed for scaling startups. Features include Business Plan Development, Investor Pitch Deck, and Market Research Analysis.",
  },
  {
    title: "Enterprise",
    para: "Tailored for established businesses. Offers Comprehensive Compliance Management, Strategic Consultancy, and Advanced Market Insights.",
  },
];
