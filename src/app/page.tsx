import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import EventsSection from "@/components/EventsSection";
import JourneySection from "@/components/JourneySection";
import TeamSection from "@/components/TeamSection";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <EventsSection />
      <JourneySection />
      <TeamSection />
      <FinalCTA />
    </main>
  );
}
