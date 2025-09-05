import CommonHero from "@/components/CommonHero";
import ContactForm from "@/components/contact/ContactForm";
import Info from "@/components/contact/Info";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24 px-4 py-16 pt-32 mx-auto px-6 lg:px-12">
      <CommonHero
        description="Get expert insights, legal updates, and practical guidance to help you stay informed and confident"
        title="get in touch"
      />
      <Info />
      <ContactForm />
    </div>
  );
};

export default ContactPage;
