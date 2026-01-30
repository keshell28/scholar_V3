import { motion } from 'framer-motion';

// Reusable skeleton components for loading states

export function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="animate-pulse space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6" />
        </div>
      </div>
    </motion.div>
  );
}

export function SkeletonScholarship() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-700"
    >
      <div className="animate-pulse space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
          </div>
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/5" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20" />
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24" />
        </div>
      </div>
    </motion.div>
  );
}

export function SkeletonStudentCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="animate-pulse">
        <div className="h-56 bg-gray-300 dark:bg-gray-700" />
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded flex-1" />
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded flex-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SkeletonChatMessage() {
  return (
    <div className="flex items-start gap-3 animate-pulse">
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-3/4" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonScholarship key={i} />
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <motion.div
          className="w-16 h-16 mx-auto bg-[var(--color-primary-500)] rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Loading your experience...
        </p>
      </div>
    </div>
  );
}

// Inline spinner for buttons and small areas
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-gray-300 border-t-[var(--color-primary-500)] rounded-full animate-spin`}
    />
  );
}
