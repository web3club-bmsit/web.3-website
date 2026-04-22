import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/app/components/navbar'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <main className="min-h-screen bg-black text-white pt-24 px-6 md:px-12 relative overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_50%)]" />

      <Navbar />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest">secure_admin_session_active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-mono">
            <span className="text-green-400">ADMIN</span>_CONTROL_CENTER
          </h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl backdrop-blur-sm">
            <h2 className="text-sm font-mono text-white/40 uppercase mb-2">Total Registrations</h2>
            <p className="text-3xl font-bold text-green-400">--</p>
          </div>
          <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl backdrop-blur-sm">
            <h2 className="text-sm font-mono text-white/40 uppercase mb-2">Active Users</h2>
            <p className="text-3xl font-bold text-green-400">--</p>
          </div>
          <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl backdrop-blur-sm">
            <h2 className="text-sm font-mono text-white/40 uppercase mb-2">System Status</h2>
            <p className="text-3xl font-bold text-green-400 italic">NOMINAL</p>
          </div>
        </div>

        <div className="mt-12 p-10 border border-green-500/10 rounded-2xl bg-green-500/[0.01] backdrop-blur-md">
          <h3 className="text-lg font-bold mb-4 font-mono text-white/80">Command Logs</h3>
          <p className="text-white/40 font-mono text-sm leading-relaxed mb-6">
            Welcome, Administrator. You have successfully authenticated via the Google OAuth gateway. 
            The backend is currently in monitoring mode. Data exports, event modification tools, and registration management features will be integrated once the protocol specifications are confirmed.
          </p>
          <div className="flex gap-4">
            <div className="h-1 w-24 bg-green-400/20 rounded-full overflow-hidden">
               <div className="h-full bg-green-400 animate-loading" style={{ width: '40%' }} />
            </div>
          </div>
        </div>
      </div>
      
    </main>
  )
}
