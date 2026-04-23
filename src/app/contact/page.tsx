import Navbar from "../components/navbar";

import Contact from "../components/Contact";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#08080c] text-white">
      <Navbar />
      <div className="pt-20">
        <Contact />
      </div>
    </main>
  );
}
