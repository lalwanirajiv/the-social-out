
import type { Metadata } from "next";
import OurTeam from "@/components/team/OurTeam";

export const metadata: Metadata = {
  title: "Our Team | The Social Out",
  description:
    "Meet Jatin Jawrani and Hanny, the people behind The Social Out and its artist management and entertainment experiences.",
};

export default function OurTeamPage() {
  return <OurTeam />;
}
