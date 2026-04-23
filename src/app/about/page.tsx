import Navbar from "../components/navbar";
import AboutSection from "@/components/AboutSection";


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20">
        <AboutSection />
      </div>

    </main>
  );
}
