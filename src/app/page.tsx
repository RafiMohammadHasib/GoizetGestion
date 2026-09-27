import HeroSection from '@/components/home/HeroSection';
import ValueStrip from '@/components/home/ValueStrip';
import PropertyShowcase from '@/components/home/PropertyShowcase';
import ApproachSection from '@/components/home/ApproachSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import InstagramFeed from '@/components/home/InstagramFeed';
import LandlordCTA from '@/components/home/LandlordCTA';
import ProcessTimeline from '@/components/home/ProcessTimeline';
import Testimonials from '@/components/home/Testimonials';

export default function HomePage() {
  return (
    <>
      {/* 01: Hero Section with GSAP Scroll Zoom */}
      <HeroSection />

      {/* 02: Value / Trust Strip */}
      <ValueStrip />

      {/* 03: Property Showcase & Quick Lead Generation */}
      <PropertyShowcase />

      {/* 04: Approach Section */}
      <ApproachSection />

      {/* 04: Services Grid */}
      <ServicesGrid />

      {/* 05: Owner Lead Generation CTA */}
      <LandlordCTA />

      {/* 06: Rental Management Process Timeline */}
      <ProcessTimeline />

      {/* 07: Verified Client Testimonials */}
      <Testimonials />

      {/* 08: Official Instagram Feed @goizetgestion (Gallery Right Before Footer) */}
      <InstagramFeed />
    </>
  );
}
