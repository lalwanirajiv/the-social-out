
import type { Metadata } from "next";
import PastEvents from "@/components/events/PastEvents";

export const metadata: Metadata = {
  title: "Past Events | The Social Out",
  description:
    "Explore unforgettable past events by The Social Out in Ahmedabad and Indore, including Bollytech Split, Pre-Navratri Celebration and our Indore Club Show.",
};

export default function PastEventsPage() {
  return <PastEvents />;
}
