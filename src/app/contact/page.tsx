import Navbar from "../components/navbar";

import Contact from "../components/Contact";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20">
        <Contact />
      </div>
    </main>
  );
}
