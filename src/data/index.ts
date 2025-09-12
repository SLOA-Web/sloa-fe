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
    date: "14/09/2023",
    time: "09:00 AM",
    title: "Past Conference - Spine Surgery 2023",
    summary: "Past event on spinal surgery innovations. The conference featured leading experts discussing the latest advancements and techniques in spinal surgery, providing valuable insights for practitioners.",
    doctor: "Dr. Arjuna Aluwihare",
    location: "Mount Lavinia Hotel",
    capacity: "0 / 100",
    registrationDeadline: "10/09/2023",
    agenda: [
      { time: "09:00 AM", topic: "Spinal Fusion Techniques", speaker: "Dr. Arjuna Aluwihare" },
      { time: "11:00 AM", topic: "Minimally Invasive Spine Surgery", speaker: "Dr. Chaminda Ratnatunga" },
    ],
    totalRegistrations: 0,
  },
  {
    image: "/assets/images/homepage_hero.svg",
    date: "20/10/2025",
    time: "10:00 AM",
    title: "Upcoming Trauma Workshop",
    summary: "A workshop on the latest trauma care techniques. Attendees will gain hands-on experience and learn from case studies, enhancing their skills in trauma assessment and emergency response.",
    doctor: "Dr. Umapathy",
    location: "Colombo General Hospital",
    capacity: "25 / 150",
    registrationDeadline: "15/10/2025",
    agenda: [
      { time: "10:00 AM", topic: "Trauma Assessment", speaker: "Dr. Umapathy" },
      { time: "12:00 PM", topic: "Emergency Response", speaker: "Dr. Silva" },
    ],
    totalRegistrations: 25,
  },
  {
    image: "/assets/images/about_us.svg",
    date: "05/12/2025",
    time: "08:30 AM",
    title: "Orthopaedic Innovations Summit",
    summary: "Summit on new technologies in orthopaedics. This event brings together innovators and practitioners to explore robotics, AI, and other emerging trends shaping the future of orthopaedic care.",
    doctor: "Dr. Perera",
    location: "Kandy City Center",
    capacity: "80 / 200",
    registrationDeadline: "01/12/2025",
    agenda: [
      { time: "08:30 AM", topic: "Robotics in Surgery", speaker: "Dr. Perera" },
      { time: "10:00 AM", topic: "AI in Patient Care", speaker: "Dr. Fernando" },
    ],
    totalRegistrations: 80,
  },
  {
    image: "/assets/images/membership.svg",
    date: "12/01/2026",
    time: "09:30 AM",
    title: "Annual Members Meetup",
    summary: "Networking and knowledge sharing for SLOA members. The meetup offers opportunities for collaboration, professional development, and updates on association initiatives.",
    doctor: "Dr. Jayasinghe",
    location: "Galle Face Hotel",
    capacity: "60 / 120",
    registrationDeadline: "10/01/2026",
    agenda: [
      { time: "09:30 AM", topic: "Welcome & Keynote", speaker: "Dr. Jayasinghe" },
      { time: "11:00 AM", topic: "Panel Discussion", speaker: "Various" },
    ],
    totalRegistrations: 60,
  },
  {
    image: "/assets/images/our-mission.webp",
    date: "18/02/2026",
    time: "11:00 AM",
    title: "Mission Outreach Camp",
    summary: "Free orthopaedic checkups and awareness. The camp aims to serve the community by providing essential screenings and educational sessions on bone health and injury prevention.",
    doctor: "Dr. Fernando",
    location: "Matara Base Hospital",
    capacity: "100 / 200",
    registrationDeadline: "15/02/2026",
    agenda: [
      { time: "11:00 AM", topic: "Screening Camp", speaker: "Dr. Fernando" },
      { time: "01:00 PM", topic: "Awareness Session", speaker: "Dr. Silva" },
    ],
    totalRegistrations: 100,
  },
  {
    image: "/assets/images/our-vision.webp",
    date: "10/03/2026",
    time: "10:30 AM",
    title: "Vision for Future Conference",
    summary: "Discussing the future of orthopaedics in Sri Lanka. Experts will share insights on upcoming trends, challenges, and strategies for advancing orthopaedic care nationwide.",
    doctor: "Dr. Wijesinghe",
    location: "BMICH",
    capacity: "150 / 300",
    registrationDeadline: "05/03/2026",
    agenda: [
      { time: "10:30 AM", topic: "Opening Ceremony", speaker: "Dr. Wijesinghe" },
      { time: "12:00 PM", topic: "Future Trends", speaker: "Dr. Perera" },
    ],
    totalRegistrations: 150,
  },
  {
    image: "/assets/images/small_logo.png",
    date: "22/04/2026",
    time: "09:00 AM",
    title: "Young Surgeons Forum",
    summary: "A platform for young orthopaedic surgeons to present research. The forum encourages knowledge exchange, mentorship, and the development of future leaders in orthopaedics.",
    doctor: "Dr. Silva",
    location: "Jaffna Teaching Hospital",
    capacity: "40 / 80",
    registrationDeadline: "18/04/2026",
    agenda: [
      { time: "09:00 AM", topic: "Research Presentations", speaker: "Dr. Silva" },
      { time: "11:00 AM", topic: "Mentorship Session", speaker: "Dr. Umapathy" },
    ],
    totalRegistrations: 40,
  },
  {
    image: "/assets/images/benefit1.svg",
    date: "15/05/2026",
    time: "08:00 AM",
    title: "Community Health Day",
    summary: "Orthopaedic health awareness for the public. The event includes free consultations, seminars, and interactive sessions to promote bone and joint health in the community.",
    doctor: "Dr. Perera",
    location: "Kurunegala Hospital",
    capacity: "90 / 150",
    registrationDeadline: "10/05/2026",
    agenda: [
      { time: "08:00 AM", topic: "Free Checkups", speaker: "Dr. Perera" },
      { time: "10:00 AM", topic: "Public Seminar", speaker: "Dr. Fernando" },
    ],
    totalRegistrations: 90,
  },
  {
    image: "/assets/images/cta.svg",
    date: "30/06/2026",
    time: "10:00 AM",
    title: "Surgical Skills Workshop",
    summary: "Hands-on training for orthopaedic surgical skills. Participants will practice advanced techniques under expert guidance, improving their proficiency and confidence.",
    doctor: "Dr. Jayasinghe",
    location: "Negombo Hospital",
    capacity: "70 / 100",
    registrationDeadline: "25/06/2026",
    agenda: [
      { time: "10:00 AM", topic: "Surgical Techniques", speaker: "Dr. Jayasinghe" },
      { time: "12:00 PM", topic: "Q&A Session", speaker: "Panel" },
    ],
    totalRegistrations: 70,
  },
  {
    image: "/assets/images/book_events.svg",
    date: "12/07/2026",
    time: "09:00 AM",
    title: "Book Launch & Seminar",
    summary: "Launch of new orthopaedic reference book and seminar. The event features expert talks, book signings, and discussions on the latest research and clinical practices.",
    doctor: "Dr. Umapathy",
    location: "Colombo Library Auditorium",
    capacity: "30 / 60",
    registrationDeadline: "10/07/2026",
    agenda: [
      { time: "09:00 AM", topic: "Book Launch", speaker: "Dr. Umapathy" },
      { time: "10:30 AM", topic: "Seminar", speaker: "Dr. Silva" },
    ],
    totalRegistrations: 30,
  },
];

export const BENEFITS_LIST = [
  {
    image: "/assets/images/benefit1.svg",
    title: "Exclusive Networking",
    para: "Connect with leading professionals and peers in your field at national and international events.",
  },
  {
    image: "/assets/images/benefit1.svg",
    title: "Research Grants",
    para: "Apply for special funding opportunities to support your innovative research projects.",
  },
  {
    image: "/assets/images/benefit1.svg",
    title: "Mentorship Programs",
    para: "Gain guidance from experienced mentors to accelerate your career growth and clinical skills.",
  },
  {
    image: "/assets/images/benefit1.svg",
    title: "Access to Journals",
    para: "Enjoy complimentary access to top orthopaedic journals and the latest scientific publications.",
  },
  {
    image: "/assets/images/benefit1.svg",
    title: "Discounted Conference Fees",
    para: "Benefit from reduced registration fees for workshops, seminars, and annual conferences.",
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
      "Comprehensive workshop on managing neglected trauma cases, focusing on advanced surgical techniques and rehabilitation approaches.",
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
      "Advanced seminar covering the latest trauma care protocols, emergency response techniques, and interdisciplinary approaches to complex cases.",
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
      "Community awareness session on trauma prevention, first aid, and the importance of timely medical intervention for orthopaedic injuries.",
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
      "Interactive workshop on post-trauma healing, rehabilitation techniques, and psychological support for patients recovering from orthopaedic injuries.",
    dateBg: "bg-[#D47045]",
  },
];

export const NAVBAR = [
  { title: "Home", href: "/" },
  { title: "About Us", href: "/about" },
  { title: "Events", href: "/events" },
  { title: "Contact", href: "/contact" },
  { title: "Membership", href: "/get-involved" },
];

export const TOP_BAR_LINKS = [
  { title: "Resources", href: "/resources" },
  { title: "News & Media", href: "/news-media" },
    { title: "Member Directory", href: "/member-directory" },
  { title: "Log In", href: "/login" },
];

export const DOCUMENTATION_LINKS = [
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms and Conditions", href: "/terms-and-conditions" },
];

export const BENEFITS = [
  {
    title: "Medical Council Registration",
    para: "Must be a registered medical practitioner approved by the Sri Lanka Medical Council with current license and certification in good standing.",
  },
  {
    title: "Orthopaedic Specialization",
    para: "Demonstrated expertise in orthopaedics through formal training, board certification, or equivalent qualification in musculoskeletal medicine.",
  },
  {
    title: "Professional Experience",
    para: "Minimum of 2 years clinical experience in orthopaedics with commitment to continuing medical education and professional development.",
  },
];
