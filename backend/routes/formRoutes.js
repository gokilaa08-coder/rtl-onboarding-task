const express = require('express');
const auth = require('../middleware/auth');
const OnboardingResponse = require('../models/OnboardingResponse');

const router = express.Router();

// GET /api/form/progress - Fetch previously saved data (Autosave/Persistent Data)
router.get('/progress', auth, async (req, res) => {
  try {
    let response = await OnboardingResponse.findOne({ userId: req.user.id });
    if (!response) {
      response = await OnboardingResponse.create({ userId: req.user.id, currentStep: 1 });
    }
    return res.status(200).json({ success: true, data: response });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve form data', error: err.message });
  }
});

// POST /api/form/save-step - Saves current step's data on forward / navigate
router.post('/save-step', auth, async (req, res) => {
  try {
    const { stepNumber, stepData, nextStep } = req.body;

    const updateQuery = {};
    if (stepNumber && stepData) {
      updateQuery[`step${stepNumber}`] = stepData;
    }
    if (nextStep) {
      updateQuery.currentStep = nextStep;
    }

    const updated = await OnboardingResponse.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateQuery },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to persist step data', error: err.message });
  }
});

// POST /api/form/submit - Final submission handler
router.post('/submit', auth, async (req, res) => {
  try {
    const { stepData } = req.body;
    const updated = await OnboardingResponse.findOneAndUpdate(
      { userId: req.user.id },
      { 
        $set: { 
          step6: stepData, 
          isCompleted: true 
        } 
      },
      { new: true }
    );
    return res.status(200).json({ 
      success: true, 
      message: 'You have successfully completed the onboarding form', 
      data: updated 
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to submit form', error: err.message });
  }
});

module.exports = router;