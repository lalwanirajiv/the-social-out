
import type { Metadata } from "next";
import ContactUs from "@/components/home/ContactUs";

export const metadata: Metadata = {
  title: "Contact Us | The Social Out",
  description:
    "Get in touch with The Social Out for artist bookings, brand collaborations, event partnerships, and general enquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black pt-24 text-white md:pt-28">
      <ContactUs />
    </main>
  );
}
