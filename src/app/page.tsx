
import Hero from "@/components/home/Hero";
import ExperienceShowcase from "@/components/home/ExperienceShowcase";
import { getExperienceMedia } from "@/lib/media";

export default async function Home() {
  const { images, reels } = await getExperienceMedia();

  return (
    <main>
      <Hero />

      <ExperienceShowcase
        images={images}
        reels={reels}
      />
    </main>
  );
}
