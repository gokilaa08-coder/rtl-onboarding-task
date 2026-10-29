const mongoose = require('mongoose');

const onboardingResponseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    currentStep: {
      type: Number,
      default: 1,
      min: 1,
      max: 6,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    // Step 1: Personal Details (Screen 3)
    step1: {
      phone: { type: String, default: '' },
      dateOfBirth: { type: String, default: '' },
      gender: { type: String, default: '' },
    },
    // Step 2: Address Information (Screen 4)
    step2: {
      streetAddress: { type: String, default: '' },
      city: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    // Step 3: Professional Background (Screen 5)
    step3: {
      currentTitle: { type: String, default: '' },
      company: { type: String, default: '' },
      yearsExperience: { type: String, default: '' },
    },
    // Step 4: Skills & Tech Preferences (Screen 6)
    step4: {
      primarySkill: { type: String, default: '' },
      frameworkPreferences: [{ type: String }],
      githubProfile: { type: String, default: '' },
    },
    // Step 5: Work Availability & Preferences (Screen 7)
    step5: {
      workMode: { type: String, default: '' }, // e.g., Remote, Hybrid, Onsite
      noticePeriod: { type: String, default: '' },
      expectedCompensation: { type: String, default: '' },
    },
    // Step 6: Review & Additional Notes (Screen 8)
    step6: {
      additionalNotes: { type: String, default: '' },
      agreedToTerms: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OnboardingResponse', onboardingResponseSchema, 'form_entries');