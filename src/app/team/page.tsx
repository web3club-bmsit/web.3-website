import Navbar from "../components/navbar";
import TeamGrid from "@/components/TeamGrid";
import Footer from "@/components/Footer";

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <TeamGrid />
      </div>
      <Footer />
    </main>
  );
}
