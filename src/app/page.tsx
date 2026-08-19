import HeroSection from '@/components/home/HeroSection';
import ValueStrip from '@/components/home/ValueStrip';
import ApproachSection from '@/components/home/ApproachSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import LuxuryGsapSlider from '@/components/home/LuxuryGsapSlider';
import PropertyShowcase from '@/components/home/PropertyShowcase';
import LandlordCTA from '@/components/home/LandlordCTA';
import ProcessTimeline from '@/components/home/ProcessTimeline';
import BordeauxExplorer from '@/components/home/BordeauxExplorer';
import Testimonials from '@/components/home/Testimonials';
import JournalPreview from '@/components/home/JournalPreview';

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

      {/* 05: Luxury GSAP Interactive Slider */}
      <LuxuryGsapSlider />

      {/* 06: Property Showcase */}
      <PropertyShowcase />

      {/* 07: Owner Lead Generation CTA */}
      <LandlordCTA />

      {/* 08: Rental Management Process Timeline */}
      <ProcessTimeline />

      {/* 09: Bordeaux Local Neighborhood Explorer */}
      <BordeauxExplorer />

      {/* 10: Verified Client Testimonials */}
      <Testimonials />

      {/* 11: Journal Immobilier Articles */}
      <JournalPreview />
    </>
  );
}
