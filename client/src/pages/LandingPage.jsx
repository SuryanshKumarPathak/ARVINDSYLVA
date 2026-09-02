import { useState } from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import ProjectOverview from '../components/landing/ProjectOverview';
import Highlights from '../components/landing/Highlights';
import Configurations from '../components/landing/Configurations';
import Amenities from '../components/landing/Amenities';
import NatureSection from '../components/landing/NatureSection';
import Location from '../components/landing/Location';
import WhyArvind from '../components/landing/WhyArvind';
import FAQ from '../components/landing/FAQ';
import Footer from '../components/landing/Footer';
import FloatingCTA from '../components/landing/FloatingCTA';
import LeadForm from '../components/landing/LeadForm';

export default function LandingPage() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <main>
        <Header onCTAClick={() => setFormOpen(true)} />
        <Hero onCTAClick={() => setFormOpen(true)} />
        <ProjectOverview onCTAClick={() => setFormOpen(true)} />
        <Highlights onCTAClick={() => setFormOpen(true)} />
        <Configurations onCTAClick={() => setFormOpen(true)} />
        <Amenities onCTAClick={() => setFormOpen(true)} />
        <NatureSection onCTAClick={() => setFormOpen(true)} />
        <Location onCTAClick={() => setFormOpen(true)} />
        <WhyArvind onCTAClick={() => setFormOpen(true)} />
        <FAQ onCTAClick={() => setFormOpen(true)} />
        <Footer onCTAClick={() => setFormOpen(true)} />
        <FloatingCTA onCTAClick={() => setFormOpen(true)} />
      </main>

      <LeadForm open={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}
