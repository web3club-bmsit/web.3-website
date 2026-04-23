import Navbar from "../components/navbar";
import TeamGrid from "@/components/TeamGrid";

import { getTeamMembers } from "@/app/actions/admin";

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <TeamGrid members={members} />
      </div>

    </main>
  );
}
