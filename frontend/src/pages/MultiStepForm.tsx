import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const TOTAL_STEPS = 6;

export const MultiStepForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    step1: { phone: '', dateOfBirth: '', gender: '' },
    step2: { streetAddress: '', city: '', postalCode: '', country: '' },
    step3: { currentTitle: '', company: '', yearsExperience: '' },
    step4: { primarySkill: '', frameworkPreferences: ['React', 'Node'], githubProfile: '' },
    step5: { workMode: 'Remote', noticePeriod: '', expectedCompensation: '' },
    step6: { additionalNotes: '', agreedToTerms: false },
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await API.get('/form/progress');
        if (res.data.data) {
          const { step1, step2, step3, step4, step5, step6, currentStep: savedStep, isCompleted } = res.data.data;
          if (isCompleted) {
            navigate('/dashboard');
            return;
          }
          setFormData({
            step1: { ...step1 },
            step2: { ...step2 },
            step3: { ...step3 },
            step4: { ...step4 },
            step5: { ...step5 },
            step6: { ...step6 },
          });
          setCurrentStep(savedStep || 1);
        }
      } catch (err: any) {
        setError('Failed to fetch previously saved answers.');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [navigate]);

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      return formData.step1.phone.trim() !== '' && formData.step1.gender.trim() !== '';
    }
    if (currentStep === 2) {
      return formData.step2.city.trim() !== '' && formData.step2.country.trim() !== '';
    }
    if (currentStep === 3) {
      return formData.step3.currentTitle.trim() !== '';
    }
    if (currentStep === 4) {
      return formData.step4.primarySkill.trim() !== '';
    }
    if (currentStep === 5) {
      return formData.step5.noticePeriod.trim() !== '';
    }
    if (currentStep === 6) {
      return formData.step6.agreedToTerms === true;
    }
    return true;
  };

  const handleNext = async () => {
    setError('');
    if (!validateCurrentStep()) {
      setError('Please complete all mandatory fields for this step.');
      return;
    }

    try {
      setSaving(true);
      const stepKey = `step${currentStep}` as keyof typeof formData;
      await API.post('/form/save-step', {
        stepNumber: currentStep,
        stepData: formData[stepKey],
        nextStep: currentStep + 1,
      });
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save form step to database.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = async () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!formData.step6.agreedToTerms) {
      setError('You must accept the terms before submitting.');
      return;
    }

    try {
      setSaving(true);
      await API.post('/form/submit', { stepData: formData.step6 });
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to finalize onboarding form.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Fetching previously entered data from database...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Step {currentStep} of {TOTAL_STEPS} (Screen {currentStep + 2})
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {Math.round((currentStep / TOTAL_STEPS) * 100)}% Completed
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-slate-900 transition-all duration-300"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Personal Details</h3>
            <Input
              label="Phone Number *"
              placeholder="+1 (555) 000-0000"
              value={formData.step1.phone}
              onChange={(e) =>
                setFormData({ ...formData, step1: { ...formData.step1, phone: e.target.value } })
              }
            />
            <Input
              label="Date of Birth"
              type="date"
              value={formData.step1.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, step1: { ...formData.step1, dateOfBirth: e.target.value } })
              }
            />
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700">Gender *</label>
              <select
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                value={formData.step1.gender}
                onChange={(e) =>
                  setFormData({ ...formData, step1: { ...formData.step1, gender: e.target.value } })
                }
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Address Information</h3>
            <Input
              label="Street Address"
              placeholder="123 Innovation Way"
              value={formData.step2.streetAddress}
              onChange={(e) =>
                setFormData({ ...formData, step2: { ...formData.step2, streetAddress: e.target.value } })
              }
            />
            <Input
              label="City *"
              placeholder="San Francisco"
              value={formData.step2.city}
              onChange={(e) =>
                setFormData({ ...formData, step2: { ...formData.step2, city: e.target.value } })
              }
            />
            <Input
              label="Postal Code"
              placeholder="94105"
              value={formData.step2.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, step2: { ...formData.step2, postalCode: e.target.value } })
              }
            />
            <Input
              label="Country *"
              placeholder="United States"
              value={formData.step2.country}
              onChange={(e) =>
                setFormData({ ...formData, step2: { ...formData.step2, country: e.target.value } })
              }
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Professional Background</h3>
            <Input
              label="Current Job Title *"
              placeholder="Full Stack Developer"
              value={formData.step3.currentTitle}
              onChange={(e) =>
                setFormData({ ...formData, step3: { ...formData.step3, currentTitle: e.target.value } })
              }
            />
            <Input
              label="Current / Most Recent Company"
              placeholder="Tech Corp"
              value={formData.step3.company}
              onChange={(e) =>
                setFormData({ ...formData, step3: { ...formData.step3, company: e.target.value } })
              }
            />
            <Input
              label="Total Years of Experience"
              placeholder="3"
              type="number"
              value={formData.step3.yearsExperience}
              onChange={(e) =>
                setFormData({ ...formData, step3: { ...formData.step3, yearsExperience: e.target.value } })
              }
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Technical Skills</h3>
            <Input
              label="Primary Tech Stack *"
              placeholder="React, Node.js, TypeScript"
              value={formData.step4.primarySkill}
              onChange={(e) =>
                setFormData({ ...formData, step4: { ...formData.step4, primarySkill: e.target.value } })
              }
            />
            <Input
              label="GitHub Profile URL"
              placeholder="https://github.com/username"
              value={formData.step4.githubProfile}
              onChange={(e) =>
                setFormData({ ...formData, step4: { ...formData.step4, githubProfile: e.target.value } })
              }
            />
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Work Preferences</h3>
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700">Preferred Work Mode</label>
              <select
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                value={formData.step5.workMode}
                onChange={(e) =>
                  setFormData({ ...formData, step5: { ...formData.step5, workMode: e.target.value } })
                }
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">On-site</option>
              </select>
            </div>
            <Input
              label="Notice Period (e.g., Immediate, 30 days) *"
              placeholder="Immediate"
              value={formData.step5.noticePeriod}
              onChange={(e) =>
                setFormData({ ...formData, step5: { ...formData.step5, noticePeriod: e.target.value } })
              }
            />
            <Input
              label="Expected Compensation (Annual USD)"
              placeholder="$90,000"
              value={formData.step5.expectedCompensation}
              onChange={(e) =>
                setFormData({ ...formData, step5: { ...formData.step5, expectedCompensation: e.target.value } })
              }
            />
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Review & Confirmation</h3>
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700">Additional Notes / Remarks</label>
              <textarea
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                rows={3}
                placeholder="Any special notes or portfolio links..."
                value={formData.step6.additionalNotes}
                onChange={(e) =>
                  setFormData({ ...formData, step6: { ...formData.step6, additionalNotes: e.target.value } })
                }
              />
            </div>
            <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer pt-2">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                checked={formData.step6.agreedToTerms}
                onChange={(e) =>
                  setFormData({ ...formData, step6: { ...formData.step6, agreedToTerms: e.target.checked } })
                }
              />
              <span>I confirm all submitted information is accurate and complete.</span>
            </label>
          </div>
        )}

        <div className="mt-8 flex justify-between border-t border-slate-100 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || saving}
          >
            Back
          </Button>
          {currentStep < TOTAL_STEPS ? (
            <Button type="button" onClick={handleNext} isLoading={saving}>
              Next Step
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} isLoading={saving}>
              Submit Onboarding
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};