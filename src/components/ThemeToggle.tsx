import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

export default function ThemeToggle() {
  const { mode, resolvedTheme, toggleMode } = useThemeStore();

  const getIcon = () => {
    if (mode === 'system') {
      return <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
    if (resolvedTheme === 'dark') {
      return <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
    return <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
  };

  const getLabel = () => {
    if (mode === 'system') {
      return `System (${resolvedTheme}) - Click for light mode`;
    }
    if (mode === 'light') {
      return 'Light mode - Click for dark mode';
    }
    return 'Dark mode - Click for system';
  };

  return (
    <button
      onClick={toggleMode}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      aria-label={getLabel()}
      title={getLabel()}
    >
      {getIcon()}
    </button>
  );
}
