import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { storage } from '../utils/storage';

interface OnboardingStep {
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  image?: string;
  icon?: React.ReactNode;
}

interface OnboardingTourProps {
  steps: OnboardingStep[];
  onComplete: () => void;
  storageKey?: string;
}

export function OnboardingTour({ steps, onComplete, storageKey = 'scholar_onboarding_completed' }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen onboarding
    const hasCompleted = storage.get(storageKey, false);
    if (!hasCompleted) {
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    storage.set(storageKey, true);
    setIsVisible(false);
    onComplete();
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Tour Card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden pointer-events-auto"
            >
              {/* Progress Bar */}
              <div className="h-2 bg-gray-200 dark:bg-gray-700">
                <motion.div
                  className="h-full bg-[var(--color-primary-500)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-[var(--color-primary-500)]">
                        Step {currentStep + 1} of {steps.length}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentStepData.title}
                    </h2>
                  </div>
                  <button
                    onClick={handleSkip}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Icon/Image */}
                {currentStepData.icon && (
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-[var(--color-primary-500)]/10 rounded-full">
                      {currentStepData.icon}
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                  {currentStepData.description}
                </p>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {/* Step Indicators */}
                  <div className="flex gap-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition ${
                          index === currentStep
                            ? 'bg-[var(--color-primary-500)] w-6'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] transition font-medium"
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        <Check className="w-4 h-4" />
                        Get Started
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Predefined onboarding tours for different pages
export const scholarOnboardingSteps: OnboardingStep[] = [
  {
    title: 'Welcome to Scholar! 🎉',
    description: 'Your home for connecting with Zimbabwean students worldwide. Let\'s take a quick tour of the key features.',
  },
  {
    title: 'Discover Students',
    description: 'Swipe through profiles to find study buddies, mentors, or friends in your destination country.',
  },
  {
    title: 'Join Communities',
    description: 'Connect with students from your university, field of study, or country. Share experiences and get support.',
  },
  {
    title: 'Find Scholarships',
    description: 'Browse verified scholarship opportunities tailored for Zimbabwean students. Save your favorites and track deadlines.',
  },
  {
    title: 'Share Culture & Recipes',
    description: 'Stay connected to home by sharing traditional recipes and finding ingredients abroad.',
  },
  {
    title: 'You\'re All Set!',
    description: 'Start exploring and making connections. Welcome to the Scholar community!',
  },
];
