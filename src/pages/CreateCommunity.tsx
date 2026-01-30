import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Upload, 
  Users, 
  FileText,
  Settings,
  Sparkles,
  Image as ImageIcon,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Community } from '../types';

const STEPS = [
  { id: 1, name: 'Basic Info', icon: FileText },
  { id: 2, name: 'Category', icon: Settings },
  { id: 3, name: 'Image', icon: ImageIcon },
  { id: 4, name: 'Guidelines', icon: Users },
  { id: 5, name: 'Review', icon: Sparkles },
];

const CATEGORIES = [
  { value: 'country', label: 'By Country', emoji: '🌍', description: 'For students in a specific country' },
  { value: 'university', label: 'By University', emoji: '🎓', description: 'For students at the same institution' },
  { value: 'field', label: 'Field of Study', emoji: '📚', description: 'For students in similar academic fields' },
  { value: 'culture', label: 'Culture & Lifestyle', emoji: '🎨', description: 'Food, traditions, and cultural topics' },
  { value: 'other', label: 'Other', emoji: '✨', description: 'General interest communities' },
];

const SUGGESTED_GUIDELINES = [
  'Be respectful and supportive of all members',
  'Share relevant and helpful content only',
  'No spam or excessive self-promotion',
  'Keep discussions on topic',
  'Report inappropriate content to moderators',
  'Maintain confidentiality when sharing personal experiences',
];

export default function CreateCommunity() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '' as Community['category'] | '',
    image: '',
    guidelines: [...SUGGESTED_GUIDELINES],
    customGuideline: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Community name is required';
      } else if (formData.name.length < 3) {
        newErrors.name = 'Name must be at least 3 characters';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.length < 20) {
        newErrors.description = 'Description must be at least 20 characters';
      }
    }

    if (step === 2) {
      if (!formData.category) {
        newErrors.category = 'Please select a category';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addCustomGuideline = () => {
    if (formData.customGuideline.trim()) {
      setFormData({
        ...formData,
        guidelines: [...formData.guidelines, formData.customGuideline.trim()],
        customGuideline: '',
      });
    }
  };

  const removeGuideline = (index: number) => {
    setFormData({
      ...formData,
      guidelines: formData.guidelines.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    // In real app: API call to create community
    toast.success('🎉 Community created successfully!');
    setTimeout(() => {
      navigate('/communities');
    }, 1500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Let's start with the basics
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Give your community a name and description that clearly explains its purpose
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Community Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Zim Students in Canada"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-[var(--color-primary-500)]'
                } bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:border-transparent`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose a clear, descriptive name ({formData.name.length}/60)
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this community is about and who should join..."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.description 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-[var(--color-primary-500)]'
                } bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:border-transparent resize-none`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Minimum 20 characters ({formData.description.length}/500)
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Choose a category
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This helps students find your community more easily
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setFormData({ ...formData, category: category.value as Community['category'] })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.category === category.value
                      ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{category.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                        {category.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.description}
                      </p>
                    </div>
                    {formData.category === category.value && (
                      <Check className="h-5 w-5 text-[var(--color-primary-500)] flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Add a community image
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upload an image that represents your community (optional but recommended)
              </p>
            </div>

            <div className="flex flex-col items-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Community preview"
                    className="w-48 h-48 rounded-xl object-cover"
                  />
                  <button
                    onClick={() => {
                      setImagePreview('');
                      setFormData({ ...formData, image: '' });
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="w-48 h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[var(--color-primary-500)] transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 Tip: Use an image that clearly represents your community. Communities with images get 3x more engagement!
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Set community guidelines
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                These rules help maintain a positive and respectful environment
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Community Rules
              </h3>
              <div className="space-y-2">
                {formData.guidelines.map((guideline, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group"
                  >
                    <Check className="h-5 w-5 text-[var(--color-primary-500)] flex-shrink-0 mt-0.5" />
                    <span className="flex-1 text-gray-700 dark:text-gray-300 text-sm">
                      {guideline}
                    </span>
                    {index >= SUGGESTED_GUIDELINES.length && (
                      <button
                        onClick={() => removeGuideline(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4 text-red-500 hover:text-red-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Add Custom Guideline (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.customGuideline}
                  onChange={(e) => setFormData({ ...formData, customGuideline: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomGuideline()}
                  placeholder="Add your own guideline..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                />
                <button
                  onClick={addCustomGuideline}
                  disabled={!formData.customGuideline.trim()}
                  className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Review your community
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Make sure everything looks good before creating your community
              </p>
            </div>

            {/* Preview Card */}
            <div className="card border-2 border-[var(--color-primary-200)] dark:border-[var(--color-primary-800)]">
              <div className="flex items-start gap-4 mb-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={formData.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)] flex items-center justify-center text-white text-2xl font-bold">
                    {formData.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                    {formData.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 inline mr-1" />0 members
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="inline-block px-2 py-0.5 bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]/30 text-[var(--color-primary-700)] dark:text-[var(--color-primary-300)] rounded text-xs font-semibold capitalize">
                      {formData.category}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 break-words overflow-wrap-anywhere">
                {formData.description}
              </p>

              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">
                  Community Guidelines
                </h4>
                <div className="space-y-1">
                  {formData.guidelines.slice(0, 3).map((guideline, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[var(--color-primary-500)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{guideline}</span>
                    </div>
                  ))}
                  {formData.guidelines.length > 3 && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      +{formData.guidelines.length - 3} more guidelines
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-[var(--color-primary-500)] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[var(--color-primary-900)] dark:text-[var(--color-primary-100)] mb-1">
                    Ready to launch!
                  </h4>
                  <p className="text-sm text-[var(--color-primary-700)] dark:text-[var(--color-primary-300)]">
                    Once created, you'll be the admin of this community. You can invite members, manage posts, and apply for verification once you reach 100 members.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/communities')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Communities
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Create a Community
          </h1>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10" />
            <div 
              className="absolute top-5 left-0 h-0.5 bg-[var(--color-primary-500)] -z-10 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />

            {STEPS.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isCompleted
                        ? 'bg-[var(--color-primary-500)] text-white'
                        : isCurrent
                        ? 'bg-[var(--color-primary-500)] text-white ring-4 ring-[var(--color-primary-100)] dark:ring-[var(--color-primary-900)]/30'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs font-medium text-center hidden sm:block ${
                    isCurrent 
                      ? 'text-gray-800 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="card mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </button>

          {currentStep < STEPS.length ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] transition-colors font-semibold"
            >
              Next
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] transition-colors font-semibold"
            >
              <Check className="h-5 w-5" />
              Create Community
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
