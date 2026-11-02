import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [generatedCourse, setGeneratedCourse] = useState<string | null>(null);
  const [connectedApps, setConnectedApps] = useState<{ [key: string]: boolean }>({
    LeetCode: false,
    HackerRank: true,
    Dribbble: false,
  });

  // Fetch form submissions from MongoDB
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await API.get('/form/progress');
        if (res.data?.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    fetchProgress();
  }, []);

  const handleConnect = (app: string) => {
    setConnectedApps((prev) => ({ ...prev, [app]: !prev[app] }));
  };

  const handleGenerateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl) return;
    setGeneratedCourse(`Course generated from: ${youtubeUrl} — 4 modules created with AI quiz!`);
  };

  const userSkills: string[] =
    data?.step4?.selectedSkills && data.step4.selectedSkills.length > 0
      ? data.step4.selectedSkills
      : ['React.js', 'Node.js', 'TypeScript', 'TailwindCSS', 'MongoDB'];

  return (
    <div className="flex min-h-screen bg-[#F6F8FA] font-sans text-slate-800">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="w-60 flex-shrink-0 border-r border-slate-200 bg-white p-5 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setActiveTab('Dashboard')}
          >
            <div className="h-6 w-6 rounded bg-[#FF5722] text-center text-xs font-bold text-white flex items-center justify-center">
              R
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900">Record</span>
              <span className="ml-1 text-[10px] text-slate-400">v1.25.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1 text-xs">
            {[
              { id: 'Dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'Profile', label: 'Profile', icon: '👤' },
              { id: 'Skill Repository', label: 'Skill Repository', icon: '🗃️' },
              { id: 'Learnings', label: 'Learnings', icon: '🎓' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center space-x-2.5 rounded-lg px-3 py-2 text-left font-medium transition ${
                  activeTab === item.id
                    ? 'bg-orange-50 font-bold text-[#FF5722] border-l-2 border-[#FF5722]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            {/* Jobs Section */}
            <div className="pt-4">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Jobs
              </span>
              {[
                { id: 'Offers', label: 'Offers', badge: '1 New' },
                { id: 'Applied', label: 'Applied', badge: '3' },
              ].map((job) => (
                <button
                  key={job.id}
                  onClick={() => setActiveTab(job.id)}
                  className={`mt-1 flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-slate-600 hover:bg-slate-50 transition ${
                    activeTab === job.id ? 'font-bold text-[#FF5722] bg-orange-50/50' : ''
                  }`}
                >
                  <span>{job.label}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500 font-semibold">
                    {job.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Tools Section */}
            <div className="pt-4">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tools
              </span>
              {[
                { id: 'YouTube to Course', label: 'YouTube to Course' },
                { id: 'One Click Resume', label: 'One Click Resume' },
                { id: 'AI Assessment', label: 'AI Assessment' },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`mt-1 flex w-full items-center space-x-2 rounded-lg px-3 py-1.5 text-left text-slate-600 hover:bg-slate-50 transition ${
                    activeTab === tool.id ? 'font-bold text-[#FF5722] bg-orange-50/50' : ''
                  }`}
                >
                  <span>🛠️</span>
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-400 space-y-1">
          <div className="flex space-x-3">
            <span
              onClick={() => alert('Support: support@recordtechnologylabs.com')}
              className="hover:underline cursor-pointer"
            >
              Support
            </span>
            <span
              onClick={() => alert('Feedback submitted! Thank you.')}
              className="hover:underline cursor-pointer"
            >
              Feedback
            </span>
          </div>
          <p>© 2026 Record Technology Labs</p>
        </div>
      </aside>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOP HEADER BAR */}
        <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
            <span>⊞</span>
            <span>Dashboard</span>
            <span className="text-slate-300">/</span>
            <span className="text-[#FF5722] font-bold">{activeTab}</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="flex items-center space-x-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
            >
              <span>⚡ Upgrade</span>
            </button>

            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setActiveTab('Profile')}
            >
              <div className="h-7 w-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                {user?.name ? user.name[0].toUpperCase() : 'J'}
              </div>
              <div className="text-left text-xs leading-tight">
                <span className="block font-bold text-slate-800">{user?.name || 'John'}</span>
                <span className="block text-[10px] text-slate-400">
                  @{data?.step1?.username || 'member'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Success Banner */}
        <div className="mx-8 mt-5 flex-shrink-0 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-emerald-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
              ✓
            </span>
            <div>
              <p className="text-xs font-bold">You have successfully completed the onboarding form</p>
              <p className="text-[11px] text-emerald-600">
                Welcome, {user?.name || 'Candidate'}! All your responses are persisted in MongoDB.
              </p>
            </div>
          </div>
          <span className="rounded bg-emerald-200 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
            COMPLETED
          </span>
        </div>

        {/* TAB VIEWS BODY */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* 1. DASHBOARD OVERVIEW TAB (Figma Screen 9) */}
          {activeTab === 'Dashboard' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left 2 Cols */}
              <div className="space-y-6 lg:col-span-2">
                {/* Banner */}
                <div className="relative flex items-center justify-between overflow-hidden rounded-xl bg-gradient-to-r from-slate-950 to-slate-800 p-6 text-white shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                      POWERED BY YOUTUBE
                    </span>
                    <h2 className="mt-1 text-lg font-bold">
                      Claim Skill badges from YouTube Contents
                    </h2>
                    <button
                      onClick={() => setActiveTab('YouTube to Course')}
                      className="mt-4 rounded-md bg-white px-4 py-1.5 text-xs font-bold text-slate-900 hover:bg-slate-100 transition shadow"
                    >
                      Try the tool →
                    </button>
                  </div>
                  <div className="hidden h-24 w-40 rounded-lg bg-slate-800/80 p-2 sm:flex items-center justify-center border border-slate-700">
                    <span className="text-xs font-bold text-orange-400">Web Dev Masterclass</span>
                  </div>
                </div>

                {/* Learning in Progress */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">Learning In progress</h3>
                    <button
                      onClick={() => setActiveTab('Learnings')}
                      className="text-xs text-slate-500 hover:underline"
                    >
                      View More →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                      { title: 'Digital Marketing Mastery', prog: '93%' },
                      { title: 'MySQL Playlist', prog: '91%' },
                      { title: 'RESTful Web Services', prog: '91%' },
                      { title: 'Complete Python Pro', prog: '89%' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveTab('Learnings')}
                        className="cursor-pointer rounded-lg border border-slate-100 bg-[#FAFAFA] p-3 hover:border-orange-200 hover:bg-orange-50/20 transition"
                      >
                        <div className="h-14 w-full rounded bg-slate-200 mb-2 flex items-center justify-center text-[10px] text-slate-400 font-semibold">
                          Course {idx + 1}
                        </div>
                        <p className="truncate text-xs font-bold text-slate-800">{item.title}</p>
                        <span className="text-[10px] text-slate-400">Progress: {item.prog}</span>
                        <div className="mt-1.5 h-1 w-full rounded bg-slate-200">
                          <div className="h-1 rounded bg-blue-500" style={{ width: item.prog }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Showcase in one profile */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">Showcase in one profile</h3>
                    <span className="text-xs text-slate-400">3 platforms available</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                      { name: 'LeetCode', icon: '💻', desc: 'Highlight problem solving' },
                      { name: 'HackerRank', icon: '🟢', desc: 'Prove expertise with badges' },
                      { name: 'Dribbble', icon: '🏀', desc: 'Display creative designs' },
                    ].map((app) => (
                      <div
                        key={app.name}
                        className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                      >
                        <div className="flex items-center space-x-2">
                          <span>{app.icon}</span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{app.name}</p>
                            <p className="text-[9px] text-slate-400 truncate max-w-[85px]">{app.desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleConnect(app.name)}
                          className={`rounded px-2 py-1 text-[10px] font-semibold transition ${
                            connectedApps[app.name]
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {connectedApps[app.name] ? 'Connected ✓' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Skill Badges Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Skill Badges</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-3 text-center">
                      <span className="text-xl">🏅</span>
                      <p className="text-lg font-extrabold text-orange-600">45</p>
                      <p className="text-[10px] font-semibold text-slate-600">Role Based</p>
                    </div>
                    <div className="rounded-lg border border-red-100 bg-red-50/50 p-3 text-center">
                      <span className="text-xl">🏆</span>
                      <p className="text-lg font-extrabold text-red-600">2</p>
                      <p className="text-[10px] font-semibold text-slate-600">Super Skills</p>
                    </div>
                  </div>

                  {/* Skills from onboarding */}
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-bold text-slate-700">Your Chosen Interests:</span>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {userSkills.map((s) => (
                        <span
                          key={s}
                          className="rounded bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-medium text-rose-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-500 space-y-1">
                    <p><strong>Role:</strong> {data?.step1?.describeRole || 'Full Stack Developer'}</p>
                    <p><strong>Location:</strong> {data?.step1?.location || 'India'}</p>
                    <p><strong>Status:</strong> {data?.step5?.activelySeeking || 'Actively seeking'}</p>
                  </div>
                </div>

                {/* Heatmap */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900">Learning Activities</h3>
                    <span className="text-[10px] font-semibold text-slate-400">Jan ▾</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <span key={d} className="text-[9px] font-bold text-slate-400">{d}</span>
                    ))}
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-5 w-5 rounded-sm transition ${
                          i % 4 === 0 ? 'bg-orange-500' : i % 2 === 0 ? 'bg-orange-300' : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PROFILE TAB */}
          {activeTab === 'Profile' && (
            <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center space-x-5 border-b border-slate-100 pb-6">
                <div className="h-20 w-20 rounded-full bg-slate-200 text-3xl flex items-center justify-center font-bold text-slate-600">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{user?.name || data?.step1?.fullName}</h2>
                  <p className="text-xs text-slate-500">@{data?.step1?.username || 'candidate'}</p>
                  <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    {data?.step5?.activelySeeking || 'Actively seeking job'}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Email Address</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{user?.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 block">Current Role</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{data?.step1?.describeRole || 'Full Stack Developer'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block">Location</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{data?.step1?.location || 'India'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block">Referral Channel</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{data?.step1?.knowUsSource || 'LinkedIn'}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Verified Badges & Skills:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {userSkills.map((s) => (
                    <span key={s} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. SKILL REPOSITORY TAB */}
          {activeTab === 'Skill Repository' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-2">Skill Repository</h2>
              <p className="text-xs text-slate-500 mb-6">Manage, verify, and take assessments on your skill set.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userSkills.map((skill, i) => (
                  <div key={skill} className="rounded-lg border border-slate-200 p-4 hover:shadow-sm transition">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-slate-800">{skill}</span>
                      <span className="rounded bg-orange-100 text-orange-700 px-1.5 py-0.5 text-[10px] font-bold">
                        Level {i + 1}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">Verified by YouTube & assessment submissions.</p>
                    <button
                      onClick={() => alert(`Taking AI Assessment for ${skill}...`)}
                      className="mt-4 w-full rounded border border-slate-300 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Take Assessment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. LEARNINGS TAB */}
          {activeTab === 'Learnings' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-1">My Learnings</h2>
              <p className="text-xs text-slate-500 mb-6">Continue your ongoing playlists and video courses.</p>
              <div className="space-y-4">
                {[
                  { title: 'Digital Marketing Mastery for Business', prog: 93, duration: '12h 40m' },
                  { title: 'MySQL Complete Database Playlist', prog: 91, duration: '8h 20m' },
                  { title: 'RESTful Web Services and API Testing', prog: 91, duration: '5h 15m' },
                  { title: 'Complete Python Programming Masterclass', prog: 89, duration: '22h 00m' },
                ].map((c) => (
                  <div key={c.title} className="flex items-center justify-between rounded-lg border border-slate-100 p-4 hover:bg-slate-50">
                    <div className="w-1/2">
                      <h4 className="text-xs font-bold text-slate-800">{c.title}</h4>
                      <span className="text-[10px] text-slate-400">Total Duration: {c.duration}</span>
                      <div className="mt-2 h-1.5 w-full rounded bg-slate-200">
                        <div className="h-1.5 rounded bg-[#FF5722]" style={{ width: `${c.prog}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700">{c.prog}% Complete</span>
                      <button
                        onClick={() => alert(`Resuming ${c.title}...`)}
                        className="ml-4 rounded bg-slate-900 px-3 py-1 text-xs font-bold text-white hover:bg-slate-800"
                      >
                        Resume →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. OFFERS TAB */}
          {activeTab === 'Offers' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4">Job Offers & Invitations</h2>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5">
                <span className="rounded bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 uppercase">
                  1 New Invitation
                </span>
                <h3 className="mt-2 text-sm font-bold text-slate-900">Full Stack Engineer (MERN)</h3>
                <p className="text-xs text-slate-600 mt-1">Record Technology Labs • Remote / Hybrid • $85,000 - $110,000</p>
                <div className="mt-4 flex space-x-3">
                  <button onClick={() => alert('Offer accepted!')} className="rounded bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">
                    Review Offer
                  </button>
                  <button onClick={() => alert('Message sent to recruiter')} className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-700 bg-white">
                    Contact Recruiter
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. APPLIED TAB */}
          {activeTab === 'Applied' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4">Applied Roles (3)</h2>
              <div className="space-y-3">
                {[
                  { role: 'Frontend React Developer', company: 'Zoho', status: 'Under Review', date: 'Yesterday' },
                  { role: 'Full Stack Node.js Engineer', company: 'Notion', status: 'Assessment Shared', date: '3 days ago' },
                  { role: 'Software Engineer - Intern', company: 'AWS', status: 'Applied', date: 'Last week' },
                ].map((job) => (
                  <div key={job.role} className="flex justify-between items-center rounded-lg border border-slate-100 p-4">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{job.role}</p>
                      <p className="text-[11px] text-slate-500">{job.company} • Applied {job.date}</p>
                    </div>
                    <span className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700">
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. YOUTUBE TO COURSE TAB */}
          {activeTab === 'YouTube to Course' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm max-w-2xl">
              <h2 className="text-base font-bold text-slate-900">YouTube to Course Generator</h2>
              <p className="text-xs text-slate-500 mt-1">Convert any YouTube playlist or video into structured lessons with skill verification.</p>
              <form onSubmit={handleGenerateCourse} className="mt-4 flex space-x-2">
                <input
                  type="url"
                  placeholder="Paste YouTube video or playlist URL..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                  required
                />
                <button type="submit" className="rounded-md bg-[#FF5722] px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 transition">
                  Generate
                </button>
              </form>
              {generatedCourse && (
                <div className="mt-4 rounded-lg bg-orange-50 border border-orange-200 p-4 text-xs text-orange-900">
                  ✓ {generatedCourse}
                </div>
              )}
            </div>
          )}

          {/* 8. ONE CLICK RESUME */}
          {activeTab === 'One Click Resume' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm max-w-xl">
              <h2 className="text-base font-bold text-slate-900">One Click Resume Generator</h2>
              <p className="text-xs text-slate-500 mt-1">Automatically compile your verified Record badges and experience into an ATS-friendly resume.</p>
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs space-y-1">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Primary Skills:</strong> {userSkills.join(', ')}</p>
                <p><strong>Badges:</strong> 45 Role Based, 2 Super Skills</p>
              </div>
              <button
                onClick={() => alert('Resume generated and downloaded as PDF!')}
                className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Download Resume (PDF)
              </button>
            </div>
          )}

          {/* 9. AI ASSESSMENT */}
          {activeTab === 'AI Assessment' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm max-w-xl">
              <h2 className="text-base font-bold text-slate-900">AI Skill Assessment</h2>
              <p className="text-xs text-slate-500 mt-1">Take real-time coding and theory challenges to verify your skills with proof badges.</p>
              <div className="mt-4 space-y-2">
                {userSkills.slice(0, 3).map((sk) => (
                  <div key={sk} className="flex justify-between items-center rounded border border-slate-100 p-3">
                    <span className="text-xs font-bold text-slate-800">{sk} Quick Test (15 mins)</span>
                    <button
                      onClick={() => alert(`Starting test for ${sk}...`)}
                      className="rounded bg-[#1D70F5] px-3 py-1 text-[11px] font-bold text-white hover:bg-blue-600"
                    >
                      Start Test
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= UPGRADE PRO MODAL ================= */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Upgrade to Record Pro ⚡</h3>
            <p className="mt-1 text-xs text-slate-500">Accelerate your hiring with unlimited assessments and direct recruiter visibility.</p>
            <div className="my-4 rounded-xl bg-orange-50 p-4 border border-orange-200">
              <div className="text-2xl font-extrabold text-[#FF5722]">$12<span className="text-xs text-slate-600 font-normal"> / month</span></div>
              <ul className="mt-2 space-y-1 text-xs text-slate-700">
                <li>✓ Unlimited AI-powered assessments</li>
                <li>✓ Priority visibility to 200+ partner recruiters</li>
                <li>✓ Verified certificate exports</li>
              </ul>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Thank you for upgrading!');
                  setShowUpgradeModal(false);
                }}
                className="rounded-md bg-[#FF5722] px-4 py-1.5 text-xs font-bold text-white hover:bg-orange-600"
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};