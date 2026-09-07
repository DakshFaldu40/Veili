import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  ChevronDown,
  Database,
  Download,
  Globe,
  LayoutDashboard,
  LogOut,
  Moon,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sun,
  Video,
} from "lucide-react";
import { useState } from "react";
import veilLogo from "@/assets/veil-logo.jpg";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [agentActive, setAgentActive] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <div className={`flex h-screen w-full font-sans transition-colors duration-300 ${isDarkTheme ? 'bg-slate-950 text-slate-100 selection:bg-teal-900/30' : 'bg-slate-50 text-slate-900 selection:bg-teal-100'}`}>
      {/* Sidebar */}
      <aside className={`flex w-64 flex-col border-r transition-colors duration-300 ${isDarkTheme ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <div className={`flex h-16 items-center gap-2 border-b px-6 transition-colors duration-300 ${isDarkTheme ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden border shadow-sm transition-colors duration-300 ${isDarkTheme ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
            <img src={veilLogo} alt="Veil Logo" className="h-full w-full object-cover" />
          </div>
          <span className={`font-display text-lg font-bold tracking-tight transition-colors duration-300 ${isDarkTheme ? 'text-slate-100' : 'text-slate-900'}`}>Veil</span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors duration-300 ${isDarkTheme ? 'border-teal-500/30 bg-teal-500/10 text-teal-400' : 'border-teal-200 bg-teal-50 text-teal-700'}`}>
            PRO
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <div className={`mb-2 px-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>
            Overview
          </div>
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isDarkTheme ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-700'}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <ShieldCheck size={18} />
            Active Protections
          </button>
          <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Activity size={18} />
            Activity Log
          </button>

          <div className={`mb-2 mt-6 px-2 text-xs font-semibold uppercase tracking-wider transition-colors ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>
            Data Vault
          </div>
          <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Database size={18} />
            Sanitized Fields
          </button>
          <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Globe size={18} />
            Network Traffic
          </button>

          <div className={`mb-2 mt-6 px-2 text-xs font-semibold uppercase tracking-wider transition-colors ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>
            System
          </div>
          <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Settings size={18} />
            Settings
          </button>
        </nav>

        <div className={`border-t p-4 space-y-2 transition-colors ${isDarkTheme ? 'border-slate-800' : 'border-slate-200'}`}>
          {/* Download Extension Button */}
          <button className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkTheme ? 'bg-white text-slate-900 hover:bg-slate-100 focus:ring-white focus:ring-offset-slate-900' : 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900'}`}>
            <Download size={16} />
            Chrome Extension
          </button>
          <Link
            to="/"
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <LogOut size={18} />
            Exit Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className={`flex h-16 items-center justify-between border-b px-8 transition-colors duration-300 ${isDarkTheme ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center gap-4">
            <h1 className={`font-display text-xl font-semibold transition-colors duration-300 ${isDarkTheme ? 'text-slate-100' : 'text-slate-900'}`}>Security Overview</h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isDarkTheme ? 'text-slate-500' : 'text-slate-400'}`} size={16} />
              <input
                type="text"
                placeholder="Search logs..."
                className={`h-9 w-64 rounded-full border pl-9 pr-4 text-sm focus:outline-none focus:ring-1 transition-colors duration-300 ${isDarkTheme ? 'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500'}`}
              />
            </div>
            
            {/* Theme Toggle */}
            <button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                title="Toggle Theme"
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all shadow-sm ${isDarkTheme ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Agent Toggle */}
            <div className={`flex items-center gap-3 rounded-full border py-1 pl-3 pr-1 transition-colors duration-300 ${isDarkTheme ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
              <span className={`text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-300' : 'text-slate-600'}`}>Agent Status</span>
              <button
                onClick={() => setAgentActive(!agentActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  agentActive ? "bg-teal-500" : (isDarkTheme ? "bg-slate-600" : "bg-slate-300")
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    agentActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <button className={`relative transition-colors ${isDarkTheme ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
              <Bell size={20} />
              <span className={`absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 ${isDarkTheme ? 'border-slate-900' : 'border-white'}`}>
                3
              </span>
            </button>

            <div className={`flex items-center gap-2 border-l pl-6 cursor-pointer transition-colors ${isDarkTheme ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${isDarkTheme ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-700'}`}>
                JD
              </div>
              <ChevronDown size={16} className={`transition-colors ${isDarkTheme ? 'text-slate-500' : 'text-slate-400'}`} />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Top Metrics Row */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Privacy Score Card */}
              <div className={`relative overflow-hidden rounded-xl border p-6 shadow-sm transition-colors duration-300 ${isDarkTheme ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <h3 className={`text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>Overall Privacy Score</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className={`font-display text-5xl font-bold tracking-tight transition-colors ${isDarkTheme ? 'text-slate-100' : 'text-slate-900'}`}>98</span>
                  <span className={`text-sm font-medium px-2 py-0.5 rounded-full transition-colors ${isDarkTheme ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>Excellent</span>
                </div>
                <div className={`mt-5 h-2 w-full rounded-full transition-colors ${isDarkTheme ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div className="h-full w-[98%] rounded-full bg-teal-500" />
                </div>
                <p className={`mt-4 text-xs transition-colors ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  Your data is highly protected across all active sessions.
                </p>
              </div>

              {/* Data Sanitized Card */}
              <div className={`rounded-xl border p-6 shadow-sm transition-colors duration-300 ${isDarkTheme ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>Data Sanitized</h3>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isDarkTheme ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                    <ShieldCheck size={16} className={`transition-colors ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className={`font-display text-4xl font-bold tracking-tight transition-colors ${isDarkTheme ? 'text-slate-100' : 'text-slate-900'}`}>1,204</span>
                  <span className={`text-xs font-medium transition-colors ${isDarkTheme ? 'text-emerald-400' : 'text-emerald-600'}`}>+12% this week</span>
                </div>
                <p className={`mt-4 text-xs transition-colors ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  PII fields masked or replaced with synthetic data before leaving your device.
                </p>
              </div>

              {/* Trackers Blocked Card */}
              <div className={`rounded-xl border p-6 shadow-sm transition-colors duration-300 ${isDarkTheme ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium transition-colors ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>Trackers Blocked</h3>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isDarkTheme ? 'bg-red-500/10' : 'bg-red-50'}`}>
                    <ShieldAlert size={16} className={`transition-colors ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className={`font-display text-4xl font-bold tracking-tight transition-colors ${isDarkTheme ? 'text-slate-100' : 'text-slate-900'}`}>482</span>
                  <span className={`text-xs font-medium transition-colors ${isDarkTheme ? 'text-emerald-400' : 'text-emerald-600'}`}>+5% this week</span>
                </div>
                <p className={`mt-4 text-xs transition-colors ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  Third-party trackers and fingerprinting attempts intercepted.
                </p>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Activity Feed */}
              <div className={`col-span-2 rounded-xl border p-6 shadow-sm transition-colors duration-300 ${isDarkTheme ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className={`font-display text-lg font-semibold transition-colors ${isDarkTheme ? 'text-slate-100' : 'text-slate-900'}`}>Recent Activity</h3>
                  <button className={`text-sm font-medium transition-colors ${isDarkTheme ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700 hover:underline'}`}>
                    View all
                  </button>
                </div>
                <div className="space-y-6">
                  {/* Activity Item 1 */}
                  <div className="flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ring-4 z-10 transition-colors ${isDarkTheme ? 'bg-emerald-500/20 ring-slate-900' : 'bg-emerald-100 ring-white'}`}>
                        <Video size={14} className={`transition-colors ${isDarkTheme ? 'text-emerald-400' : 'text-emerald-700'}`} />
                      </div>
                      <div className={`absolute top-8 h-full w-px transition-colors ${isDarkTheme ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    </div>
                    <div className="pb-6">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium transition-colors ${isDarkTheme ? 'text-slate-200' : 'text-slate-900'}`}>Video Stream Sanitized</span>
                        <span className={`text-xs transition-colors ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>2 mins ago</span>
                      </div>
                      <p className={`mt-1 text-sm transition-colors ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                        Face blurred and background obscured on <span className={`font-medium transition-colors ${isDarkTheme ? 'text-slate-300' : 'text-slate-800'}`}>meet.local</span>.
                      </p>
                    </div>
                  </div>

                  {/* Activity Item 2 */}
                  <div className="flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ring-4 z-10 transition-colors ${isDarkTheme ? 'bg-blue-500/20 ring-slate-900' : 'bg-blue-100 ring-white'}`}>
                        <Globe size={14} className={`transition-colors ${isDarkTheme ? 'text-blue-400' : 'text-blue-700'}`} />
                      </div>
                      <div className={`absolute top-8 h-full w-px transition-colors ${isDarkTheme ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    </div>
                    <div className="pb-6">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium transition-colors ${isDarkTheme ? 'text-slate-200' : 'text-slate-900'}`}>Form Submission Intercepted</span>
                        <span className={`text-xs transition-colors ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>15 mins ago</span>
                      </div>
                      <p className={`mt-1 text-sm transition-colors ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                        Sanitized 3 fields (SSN, Email, Name) on <span className={`font-medium transition-colors ${isDarkTheme ? 'text-slate-300' : 'text-slate-800'}`}>NimbusPay</span>.
                      </p>
                    </div>
                  </div>

                  {/* Activity Item 3 */}
                  <div className="flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ring-4 z-10 transition-colors ${isDarkTheme ? 'bg-red-500/20 ring-slate-900' : 'bg-red-100 ring-white'}`}>
                        <ShieldAlert size={14} className={`transition-colors ${isDarkTheme ? 'text-red-400' : 'text-red-700'}`} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium transition-colors ${isDarkTheme ? 'text-slate-200' : 'text-slate-900'}`}>Malicious Script Blocked</span>
                        <span className={`text-xs transition-colors ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>1 hour ago</span>
                      </div>
                      <p className={`mt-1 text-sm transition-colors ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                        Blocked fingerprinting attempt from <span className={`font-medium transition-colors ${isDarkTheme ? 'text-slate-300' : 'text-slate-800'}`}>tracker.evil.com</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Integrations */}
              <div className={`rounded-xl border p-6 shadow-sm transition-colors duration-300 ${isDarkTheme ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className={`font-display text-lg font-semibold transition-colors ${isDarkTheme ? 'text-slate-100' : 'text-slate-900'}`}>Active Integrations</h3>
                </div>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${isDarkTheme ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-md border p-2 shadow-sm transition-colors ${isDarkTheme ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                         <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Google_Chrome_icon_%28February_2022%29.svg" alt="Chrome" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <div className={`text-sm font-semibold transition-colors ${isDarkTheme ? 'text-slate-200' : 'text-slate-900'}`}>Chrome Extension</div>
                        <div className={`text-xs font-medium transition-colors ${isDarkTheme ? 'text-emerald-400' : 'text-emerald-600'}`}>Connected</div>
                      </div>
                    </div>
                    <button className={`transition-colors ${isDarkTheme ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                      <Settings size={16} />
                    </button>
                  </div>
                  
                  <div className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${isDarkTheme ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-md border p-2 shadow-sm transition-colors ${isDarkTheme ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                         <img src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg" alt="Google Meet" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <div className={`text-sm font-semibold transition-colors ${isDarkTheme ? 'text-slate-200' : 'text-slate-900'}`}>Google Meet Hook</div>
                        <div className={`text-xs font-medium transition-colors ${isDarkTheme ? 'text-emerald-400' : 'text-emerald-600'}`}>Connected</div>
                      </div>
                    </div>
                    <button className={`transition-colors ${isDarkTheme ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                      <Settings size={16} />
                    </button>
                  </div>

                  <div className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${isDarkTheme ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-md border p-2 shadow-sm transition-colors ${isDarkTheme ? 'border-slate-700 bg-slate-800 text-slate-400' : 'border-slate-200 bg-white text-slate-600'}`}>
                         <Smartphone size={20} />
                      </div>
                      <div>
                        <div className={`text-sm font-semibold transition-colors ${isDarkTheme ? 'text-slate-200' : 'text-slate-900'}`}>Mobile Companion</div>
                        <div className={`text-xs transition-colors ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>Not Connected</div>
                      </div>
                    </div>
                    <button className={`text-sm font-medium transition-colors ${isDarkTheme ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700 hover:underline'}`}>
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
