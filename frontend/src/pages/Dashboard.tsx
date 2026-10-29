import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Button } from '../components/ui/Button';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get('/form/progress');
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to load summary', err);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="font-bold tracking-tight text-slate-900">Record Technology Labs</span>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-700">{user?.name}</span>
            <Button variant="outline" onClick={logout} className="h-8 px-3 text-xs">
              Log Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Success Banner */}
        <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3 text-xl font-bold">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            You have successfully completed the onboarding form
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Welcome to the team, <span className="font-semibold text-slate-900">{user?.name || 'Candidate'}</span>! Your submissions have been persisted to our MongoDB database.
          </p>
        </div>

        {/* Response Overview Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Personal Profile */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Personal & Contact</h2>
            <dl className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between border-b pb-1">
                <dt>Name:</dt>
                <dd className="font-medium text-slate-900">{user?.name || 'N/A'}</dd>
              </div>
              <div className="flex justify-between border-b pb-1">
                <dt>Email:</dt>
                <dd className="font-medium text-slate-900">{user?.email || 'N/A'}</dd>
              </div>
              <div className="flex justify-between border-b pb-1">
                <dt>Phone:</dt>
                <dd className="font-medium text-slate-900">{data?.step1?.phone || 'N/A'}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Gender:</dt>
                <dd className="font-medium text-slate-900">{data?.step1?.gender || 'N/A'}</dd>
              </div>
            </dl>
          </div>

          {/* Card 2: Professional Profile */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Professional Experience</h2>
            <dl className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between border-b pb-1">
                <dt>Title:</dt>
                <dd className="font-medium text-slate-900">{data?.step3?.currentTitle || 'N/A'}</dd>
              </div>
              <div className="flex justify-between border-b pb-1">
                <dt>Company:</dt>
                <dd className="font-medium text-slate-900">{data?.step3?.company || 'N/A'}</dd>
              </div>
              <div className="flex justify-between border-b pb-1">
                <dt>Primary Skills:</dt>
                <dd className="font-medium text-slate-900">{data?.step4?.primarySkill || 'N/A'}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Work Mode:</dt>
                <dd className="font-medium text-slate-900">{data?.step5?.workMode || 'N/A'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
};