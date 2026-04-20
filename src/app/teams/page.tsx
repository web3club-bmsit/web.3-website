import Navbar from "../components/navbar";
import TeamGrid from "@/components/TeamGrid";

export default function TeamsPage() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden pt-24 pb-12">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.15),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(34,211,238,0.15),transparent_40%)]" />
      
      <Navbar />
      
      <div className="relative z-10">
        <TeamGrid />
      </div>
    </main>
  );
}
