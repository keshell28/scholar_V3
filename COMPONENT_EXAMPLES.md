# 🎯 Quick Reference - Using New Components

## 📋 Copy-Paste Examples

### 1. Page with Loading & Empty States

```tsx
import { useState, useEffect } from 'react';
import { SkeletonGrid } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { Users } from 'lucide-react';

export function MyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItems([]);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Page</h1>
        <SkeletonGrid count={6} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Page</h1>
        <EmptyState
          icon={Users}
          title="No items yet"
          description="Get started by creating your first item."
          actionLabel="Create Item"
          actionLink="/create"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Page</h1>
      {/* Your content */}
    </div>
  );
}
```

---

### 2. Searchable List with Debouncing

```tsx
import { useState } from 'react';
import { useDebounce } from '../hooks/useHooks';
import { Search } from 'lucide-react';

export function SearchableList({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-3 border-2 rounded-lg"
          aria-label="Search items"
        />
      </div>
      
      {filteredData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

---

### 3. Delete with Confirmation

```tsx
import { useConfirmDialog, ConfirmDialog } from '../components/ConfirmDialog';
import { Trash2 } from 'lucide-react';

export function ItemCard({ item, onDelete }) {
  const { dialogProps, openDialog } = useConfirmDialog();

  const handleDelete = () => {
    openDialog({
      title: 'Delete Item',
      message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
      onConfirm: () => {
        onDelete(item.id);
        // Optionally show success toast
      },
    });
  };

  return (
    <>
      <div className="p-4 border rounded-lg">
        <h3>{item.name}</h3>
        <button
          onClick={handleDelete}
          className="mt-2 flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
      
      <ConfirmDialog {...dialogProps} />
    </>
  );
}
```

---

### 4. Form with Validation (Ready for Backend)

```tsx
import { useState } from 'react';
import { Spinner } from '../components/LoadingSkeleton';

export function MyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success toast
      console.log('Success!');
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[var(--color-primary-500)] text-white py-3 rounded-lg hover:bg-[var(--color-primary-600)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Spinner size="sm" />
            Submitting...
          </>
        ) : (
          'Submit'
        )}
      </button>
    </form>
  );
}
```

---

### 5. Persistent State with localStorage

```tsx
import { useLocalStorage } from '../utils/storage';

export function SettingsPage() {
  const [theme, setTheme] = useLocalStorage('app_theme', 'light');
  const [notifications, setNotifications] = useLocalStorage('notifications_enabled', true);
  const [language, setLanguage] = useLocalStorage('language', 'en');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-4">
        {/* Theme */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold">Theme</h3>
            <p className="text-sm text-gray-600">Choose your display theme</p>
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-sm text-gray-600">Receive updates</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full transition ${
              notifications ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition transform ${
              notifications ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### 6. Keyboard Shortcuts

```tsx
import { useKeyboardShortcut } from '../hooks/useHooks';
import { useState } from 'react';
import { Search } from 'lucide-react';

export function MyPage() {
  const [showSearch, setShowSearch] = useState(false);

  // Ctrl/Cmd + K to open search
  useKeyboardShortcut('k', () => setShowSearch(true), { ctrl: true });

  // Escape to close
  useKeyboardShortcut('Escape', () => setShowSearch(false));

  return (
    <div>
      <div className="text-sm text-gray-600 mb-4">
        Press <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+K</kbd> to search
      </div>

      {showSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border rounded-lg"
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 7. Copy to Clipboard

```tsx
import { useCopyToClipboard } from '../hooks/useHooks';
import { Copy, Check } from 'lucide-react';

export function ShareableLink({ url }) {
  const [copy, isCopied] = useCopyToClipboard();

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={url}
        readOnly
        className="flex-1 px-4 py-2 border rounded-lg bg-gray-50"
      />
      <button
        onClick={() => copy(url)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
      >
        {isCopied ? (
          <>
            <Check className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}
```

---

### 8. Offline Detection

```tsx
import { useOnlineStatus } from '../hooks/useHooks';
import { WifiOff } from 'lucide-react';

export function MyDataComponent() {
  const isOnline = useOnlineStatus();

  const handleSubmit = () => {
    if (!isOnline) {
      alert('You are offline. Please check your connection.');
      return;
    }
    
    // Continue with submission
  };

  return (
    <div>
      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <WifiOff className="w-5 h-5" />
            <p className="text-sm">You're offline. Some features may not work.</p>
          </div>
        </div>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={!isOnline}
        className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50"
      >
        Submit
      </button>
    </div>
  );
}
```

---

### 9. Responsive Mobile Menu

```tsx
import { useMediaQuery } from '../hooks/useHooks';
import { useClickOutside } from '../hooks/useHooks';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const menuRef = useClickOutside(() => setIsOpen(false));

  if (!isMobile) {
    return (
      <nav className="flex gap-6">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    );
  }

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-6"
        >
          <nav className="flex flex-col gap-4">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      )}
    </>
  );
}
```

---

### 10. Error Handling Pattern

```tsx
import { useState } from 'react';
import { ErrorState } from '../components/ErrorBoundary';

export function DataFetcher() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchData}
      />
    );
  }

  return (
    <div>
      {/* Your component */}
    </div>
  );
}
```

---

## 🎨 **Styling Tips**

All components use your existing Tailwind classes and CSS variables:
- `var(--color-primary-500)` for brand green
- `var(--color-accent-500)` for yellow accents
- Dark mode classes already included

## 📱 **Mobile-First**

All components are responsive by default:
- Use `sm:`, `md:`, `lg:` breakpoints
- Touch-friendly tap targets (min 44px)
- Readable text sizes on mobile

---

**Pro Tip:** Mix and match these examples to build any feature you need!
