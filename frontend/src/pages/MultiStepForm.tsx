import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const TOTAL_STEPS = 6; // Screens 3, 4, 5, 6, 7, 8

const BUSINESS_SKILLS = [
  'DaVinci Resolve', 'Microsoft SharePoint', 'IIBA Entry Certificate in Business Analysis',
  'Microsoft Project', 'Operations Management', 'Microsoft Access', 'Management Skills',
  'Lean', 'Sony Vegas', 'Quality Checking', 'Business Model Canvas', 'Technical Writing',
  'HR Analytics', 'Online Course Creation', 'Microsoft PowerPoint'
];

const DESIGN_SKILLS = [
  'Cinematic Editing', 'Wix', 'Adobe Premiere Pro', 'User Experience (UX) design',
  'Fashion', 'Game Design', 'Canva', 'Character Design', 'Sewing',
  'Building Information Modelling (BIM)', 'Mobile App design', 'Textiles',
  'Illustration', 'Virtual Reality', 'UI/UX'
];

export const MultiStepForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchSkill, setSearchSkill] = useState('');

  // Persistent Form State
  const [formData, setFormData] = useState({
    step1: {
      fullName: user?.name || '',
      username: '',
      describeRole: 'Full Stack Developer',
      location: 'India',
      knowUsSource: 'LinkedIn',
    },
    step2: {
      goals: ['Build my Skill Repository'] as string[],
    },
    step3: {
      viewedInfo: true,
    },
    step4: {
      selectedSkills: ['DaVinci Resolve', 'Microsoft SharePoint', 'Microsoft Project', 'Operations Management', 'Technical Writing'] as string[],
    },
    step5: {
      profilePhotoUrl: '',
      activelySeeking: 'Yes, actively seeking',
    },
  });

  // Fetch persisted data from MongoDB
  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const res = await API.get('/form/progress');
        if (res.data?.data) {
          const { step1, step2, step3, step4, step5, currentStep: savedStep, isCompleted } = res.data.data;
          if (isCompleted) {
            navigate('/dashboard');
            return;
          }
          setFormData((prev) => ({
            step1: { ...prev.step1, ...step1, fullName: step1?.fullName || user?.name || '' },
            step2: { ...prev.step2, ...step2 },
            step3: { ...prev.step3, ...step3 },
            step4: { ...prev.step4, ...step4 },
            step5: { ...prev.step5, ...step5 },
          }));
          if (savedStep) setCurrentStep(savedStep);
        }
      } catch (err) {
        console.error('Failed to load progress from DB', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedData();
  }, [navigate, user]);

  const toggleGoal = (goal: string) => {
    const current = formData.step2.goals;
    if (current.includes(goal)) {
      setFormData({ ...formData, step2: { goals: current.filter((g) => g !== goal) } });
    } else {
      setFormData({ ...formData, step2: { goals: [...current, goal] } });
    }
  };

  const toggleSkill = (skill: string) => {
    const current = formData.step4.selectedSkills;
    if (current.includes(skill)) {
      setFormData({ ...formData, step4: { selectedSkills: current.filter((s) => s !== skill) } });
    } else {
      if (current.length >= 5) {
        setError('Maximum 5 skills can be selected.');
        return;
      }
      setError('');
      setFormData({ ...formData, step4: { selectedSkills: [...current, skill] } });
    }
  };

  const handleNext = async () => {
    setError('');
    try {
      setSaving(true);
      const stepKey = `step${currentStep}` as keyof typeof formData;
      await API.post('/form/save-step', {
        stepNumber: currentStep,
        stepData: formData[stepKey],
        nextStep: currentStep + 1,
      });

      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
      } else {
        await API.post('/form/submit', { stepData: formData.step5 });
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save form step to database.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Keyboard Enter support matching Figma footer hint ("or press Enter")
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !saving) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-xs font-semibold text-slate-400">Loading your onboarding session...</p>
      </div>
    );
  }

  // Calculate percentage for sailing ship position
  const progressPercent = Math.round((currentStep / TOTAL_STEPS) * 100);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-white font-sans text-slate-800">
      {/* ================= TOP HEADER (Figma) ================= */}
      <header className="relative w-full border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Back button */}
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 transition"
            >
              &lt; Back
            </button>
          ) : (
            <div className="w-12"></div>
          )}

          {/* Progress Bar with Sailing Ship ⛵ */}
          <div className="relative mx-8 w-full max-w-2xl">
            <div className="h-1.5 w-full rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-slate-800 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* The Ship Icon sailing along the line */}
            <div
              className="absolute -top-3.5 -ml-2 text-base transition-all duration-300 select-none"
              style={{ left: `${progressPercent}%` }}
            >
              ⛵
            </div>
          </div>

          {/* Orange Accent Block from Figma */}
          <div className="h-7 w-12 rounded bg-[#FF5722] shadow-sm flex-shrink-0"></div>
        </div>
      </header>

      {/* ================= MAIN FORM CONTAINER ================= */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-4 py-10">
        <div className="w-full">
          {error && (
            <div className="mx-auto mb-5 max-w-md rounded-lg bg-red-50 p-2.5 text-center text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* SCREEN 3: Basic Info (It's your time!) */}
          {currentStep === 1 && (
            <div className="mx-auto max-w-md text-center">
              <h1 className="text-2xl font-extrabold text-slate-900">It's your time!</h1>
              <p className="mt-1 text-xs text-slate-500">Let us know about yourself first.</p>

              <div className="mt-7 space-y-4 text-left">
                <div>
                  <input
                    type="text"
                    value={formData.step1.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        step1: { ...formData.step1, fullName: e.target.value },
                      })
                    }
                    placeholder="Your Name"
                    className="w-full rounded-lg border border-slate-200 bg-[#FAFAFA] px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:bg-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.step1.username}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        step1: { ...formData.step1, username: e.target.value },
                      })
                    }
                    placeholder="Your Username"
                    className="w-full rounded-lg border border-slate-200 bg-[#FAFAFA] px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:bg-white focus:outline-none transition"
                  />
                  <span className="mt-1 block text-[10px] text-slate-400">
                    ⓘ app.getrecord/username
                  </span>
                </div>

                <div>
                  <select
                    value={formData.step1.describeRole}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        step1: { ...formData.step1, describeRole: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-[#FAFAFA] px-4 py-2.5 text-xs text-slate-700 focus:border-slate-800 focus:bg-white focus:outline-none transition cursor-pointer"
                  >
                    <option value="">What best describes you?</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Student / Learner">Student / Learner</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                  </select>
                </div>

                <div>
                  <select
                    value={formData.step1.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        step1: { ...formData.step1, location: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-[#FAFAFA] px-4 py-2.5 text-xs text-slate-700 focus:border-slate-800 focus:bg-white focus:outline-none transition cursor-pointer"
                  >
                    <option value="India">Select your location (India)</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>

                <div>
                  <select
                    value={formData.step1.knowUsSource}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        step1: { ...formData.step1, knowUsSource: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-[#FAFAFA] px-4 py-2.5 text-xs text-slate-700 focus:border-slate-800 focus:bg-white focus:outline-none transition cursor-pointer"
                  >
                    <option value="">How do you know us?</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Friend/Colleague">Friend / Colleague</option>
                    <option value="Twitter">Twitter / X</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 4: Goals Selection */}
          {currentStep === 2 && (
            <div className="mx-auto max-w-md text-left">
              <h1 className="text-2xl font-extrabold text-slate-900">
                Hey {formData.step1.fullName || 'there'} 👋
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Let us know, how would you like to use Record for:
              </p>

              <h2 className="mt-7 text-sm font-bold text-slate-800">What's your main goal?</h2>

              <div className="mt-4 space-y-3.5">
                {[
                  'Build my Skill Repository',
                  'Get a Good Job',
                  'Upskill for Current Role',
                  'Explore New Skills',
                  'Make Learning a Habit!',
                  'Others',
                ].map((goal) => {
                  const isChecked = formData.step2.goals.includes(goal);
                  return (
                    <label
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className="flex cursor-pointer items-center space-x-3 text-xs text-slate-700 select-none hover:text-slate-900 transition"
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                          isChecked
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <span className="text-[10px]">✓</span>}
                      </div>
                      <span className={isChecked ? 'font-semibold text-slate-900' : ''}>
                        {goal}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCREEN 5: Value Proposition & Proof Showcase */}
          {currentStep === 3 && (
            <div className="mx-auto flex max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 shadow-md md:flex-row">
              {/* Left Column */}
              <div className="flex-1 bg-white p-8">
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  You bring the curiosity.{' '}
                  <span className="text-[#EB4D75]">We'll back it up with proof.</span>
                </h2>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                  Record is built for people like you – learners, job-seekers, builders. Whatever
                  your goal, we help you earn verified skill badges and turn effort into outcomes.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start space-x-2.5">
                    <span className="text-orange-500 text-sm">🎯</span>
                    <span>Earn verified skill badges from projects, courses &amp; YouTube</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-orange-500 text-sm">🎯</span>
                    <span>Take AI-powered assessments to showcase your skills</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-orange-500 text-sm">🎯</span>
                    <span>Share your profile &amp; badges publicly, like a mini portfolio</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-orange-500 text-sm">🎯</span>
                    <span>Be visible to 200+ recruiters hiring via Record</span>
                  </li>
                </ul>

                <div className="mt-8 border-t border-slate-100 pt-4">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Trusted &amp; Supported by
                  </span>
                  <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
                    <span>ZOHO</span>
                    <span>aws</span>
                    <span>Microsoft for Startups</span>
                    <span>Notion</span>
                    <span>StartupTN</span>
                  </div>
                </div>
              </div>

              {/* Right Navy Column with Testimonial */}
              <div className="flex w-full flex-col justify-between bg-[#151D2A] p-8 text-white md:w-80">
                <div>
                  <div className="mb-4 text-3xl">🏅</div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    "Throughout my journey spanning projects, work experience, licenses, education,
                    and even my personal YouTube learning playlist, I've built a strong skill set.
                    And now, I can see them all in one place with Record."
                  </p>
                </div>
                <div className="mt-6 border-t border-slate-700 pt-3">
                  <p className="text-xs font-bold text-white">– Arunmathavan</p>
                  <p className="text-[10px] text-slate-400">Mobile App Developer at NSIC</p>
                </div>
              </div>
            </div>
          )}

          {/* SCREENS 6 & 7: Skills Selection */}
          {currentStep === 4 && (
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-2xl font-extrabold text-slate-900">What's your Interest?</h1>
              <p className="mt-1 text-xs text-slate-500">
                Let us know what you are most curious about.
              </p>

              {/* Search Box */}
              <div className="mx-auto mt-5 max-w-md">
                <input
                  type="text"
                  placeholder="Search Skills i.e figma, front end"
                  value={searchSkill}
                  onChange={(e) => setSearchSkill(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-[#FAFAFA] px-4 py-2.5 text-xs text-slate-800 focus:border-slate-800 focus:bg-white focus:outline-none transition"
                />
                <span className="mt-1.5 block text-[11px] text-slate-500 font-medium">
                  ({formData.step4.selectedSkills.length}/5 skills selected – you can edit later)
                </span>
              </div>

              {/* Selected Badges (Screen 7 style) */}
              {formData.step4.selectedSkills.length > 0 && (
                <div className="mt-4">
                  <span className="mb-2 block text-xs font-bold text-slate-700">Selected Skills</span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {formData.step4.selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className="inline-flex cursor-pointer items-center space-x-1 rounded-md bg-[#EB4D4B] px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-[#d63b39] transition"
                      >
                        <span>{skill}</span>
                        <span className="ml-1 text-[10px]">✕</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Skills */}
              <div className="mt-7">
                <span className="text-xs font-bold text-slate-800">Business</span>
                <div className="mt-2.5 flex flex-wrap justify-center gap-2">
                  {BUSINESS_SKILLS.filter((s) =>
                    s.toLowerCase().includes(searchSkill.toLowerCase())
                  ).map((skill) => {
                    const isSelected = formData.step4.selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`rounded-md border px-3 py-1 text-[11px] transition ${
                          isSelected
                            ? 'border-[#EB4D4B] bg-[#EB4D4B] text-white font-medium'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Design Skills */}
              <div className="mt-6">
                <span className="text-xs font-bold text-slate-800">Design</span>
                <div className="mt-2.5 flex flex-wrap justify-center gap-2">
                  {DESIGN_SKILLS.filter((s) =>
                    s.toLowerCase().includes(searchSkill.toLowerCase())
                  ).map((skill) => {
                    const isSelected = formData.step4.selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`rounded-md border px-3 py-1 text-[11px] transition ${
                          isSelected
                            ? 'border-[#EB4D4B] bg-[#EB4D4B] text-white font-medium'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 8: Set Your Profile */}
          {currentStep === 5 && (
            <div className="mx-auto max-w-md text-center">
              <h1 className="text-2xl font-extrabold text-slate-900">Set your profile</h1>
              <p className="mt-1 text-xs text-slate-500">This is important!</p>

              <div className="mt-7 flex flex-col items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-4xl text-slate-400 border border-slate-200">
                  👤
                </div>
                <span className="mt-1.5 text-[10px] text-slate-400 font-medium">Your Profile Preview</span>

                <div className="mt-4">
                  <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition">
                    ⬆ Upload Photo
                    <input
                      type="file"
                      className="hidden"
                      onChange={() =>
                        setFormData({
                          ...formData,
                          step5: { ...formData.step5, profilePhotoUrl: 'uploaded' },
                        })
                      }
                    />
                  </label>
                  <span className="mt-2 block text-[10px] text-slate-400">
                    Upload Profile Picture
                  </span>
                </div>
              </div>

              <div className="mt-9 text-left">
                <p className="text-xs font-bold text-slate-800">
                  Are you actively looking for a job?
                </p>
                <div className="mt-3.5 space-y-2.5">
                  {['Yes, actively seeking', "No, I'm not looking"].map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center space-x-2.5 text-xs text-slate-700 select-none"
                    >
                      <input
                        type="radio"
                        name="jobStatus"
                        value={opt}
                        checked={formData.step5.activelySeeking === opt}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            step5: { ...formData.step5, activelySeeking: e.target.value },
                          })
                        }
                        className="accent-[#EB4D75]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Final Review Before Dashboard */}
          {currentStep === TOTAL_STEPS && (
            <div className="mx-auto max-w-md text-center">
              <h1 className="text-2xl font-extrabold text-slate-900">All Set!</h1>
              <p className="mt-1 text-xs text-slate-500">
                You're ready to explore your personalized Record dashboard.
              </p>

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left text-xs space-y-2.5">
                <div>
                  <strong>Full Name:</strong> {formData.step1.fullName}
                </div>
                <div>
                  <strong>Username:</strong> {formData.step1.username || 'N/A'}
                </div>
                <div>
                  <strong>Main Goal:</strong> {formData.step2.goals.join(', ') || 'Skill Repository'}
                </div>
                <div>
                  <strong>Selected Skills:</strong> {formData.step4.selectedSkills.join(', ')}
                </div>
                <div>
                  <strong>Job Seeking:</strong> {formData.step5.activelySeeking}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================= BOTTOM FOOTER (Figma) ================= */}
      <footer className="w-full bg-[#1E1E24] px-8 py-3.5 border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-end space-x-4">
          <span className="text-[11px] text-slate-400">or press Enter</span>
          <button
            onClick={handleNext}
            disabled={saving}
            className="rounded-md bg-[#1D70F5] px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-600 transition active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? 'Saving...' : currentStep === TOTAL_STEPS ? 'Go to Dashboard' : 'Continue'}
          </button>
        </div>
      </footer>
    </div>
  );
};