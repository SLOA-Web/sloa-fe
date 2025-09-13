import CommonHero from "@/components/CommonHero";
import ContactForm from "@/components/contact/ContactForm";
import Info from "@/components/contact/Info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Sri Lanka Orthopaedic Association",
};

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24 px-4 py-16 pt-32 mx-auto px-6 lg:px-12">
      <CommonHero
        title="Contact Us"
        description="Contact the Sri Lanka Orthopaedic Association for enquiries or support."
      />
      <Info />
      <ContactForm />
    </div>
  );
};

export default ContactPage;
