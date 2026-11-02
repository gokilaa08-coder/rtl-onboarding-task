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
    // Screen 3: Basic Info
    step1: {
      fullName: { type: String, default: '' },
      username: { type: String, default: '' },
      describeRole: { type: String, default: '' },
      location: { type: String, default: '' },
      knowUsSource: { type: String, default: '' },
    },
    // Screen 4: Main Goals
    step2: {
      goals: [{ type: String }],
    },
    // Screen 5: Value Proposition Acknowledged
    step3: {
      viewedInfo: { type: Boolean, default: true },
    },
    // Screens 6 & 7: Skills Selection
    step4: {
      selectedSkills: [{ type: String }],
    },
    // Screen 8: Profile Photo & Job Seeking Status
    step5: {
      profilePhotoUrl: { type: String, default: '' },
      activelySeeking: { type: String, default: 'Yes, actively seeking' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OnboardingResponse', onboardingResponseSchema, 'form_entries');