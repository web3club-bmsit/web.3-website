import Navbar from "../components/navbar";
import Events from "../components/events";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#08080c] text-white">
      <Navbar />
      <div className="pt-20">
        <Events />
      </div>
    </main>
  );
}
