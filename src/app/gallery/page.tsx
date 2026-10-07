import type { Metadata } from "next";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageHero, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Photo & Video Gallery",
  description: "Photos and video from Summit Line Academy offensive line training, camps and clinics in Kansas City.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="Gallery" title={<>See the <span className="text-gold">work.</span></>} intro="Training, athletes, coaches, camps, clinics and action shots." />
      <Section>
        <GalleryGrid />
      </Section>
    </>
  );
}
