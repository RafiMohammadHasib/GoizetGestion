import HeroSection from '@/components/home/HeroSection';
import ValueStrip from '@/components/home/ValueStrip';
import ApproachSection from '@/components/home/ApproachSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import InstagramFeed from '@/components/home/InstagramFeed';
import LandlordCTA from '@/components/home/LandlordCTA';
import ProcessTimeline from '@/components/home/ProcessTimeline';
import MaisonCalveSection from '@/components/home/MaisonCalveSection';
import Testimonials from '@/components/home/Testimonials';

export default function HomePage() {
  return (
    <>
      {/* 01: Hero Section with GSAP Scroll Zoom */}
      <HeroSection />

      {/* 02: Value / Trust Strip */}
      <ValueStrip />

      {/* 03: Approach Section */}
      <ApproachSection />

      {/* 04: Services Grid */}
      <ServicesGrid />

      {/* 05: Owner Lead Generation CTA */}
      <LandlordCTA />

      {/* 06: Rental Management Process Timeline */}
      <ProcessTimeline />

      {/* 07: Maison Calvé — Signature Coworking & Commercial Workspace Showcase */}
      <MaisonCalveSection />

      {/* 08: Verified Client Testimonials */}
      <Testimonials />

      {/* 09: Official Instagram Feed @goizetgestion (Gallery Right Before Footer) */}
      <InstagramFeed />
    </>
  );
}
