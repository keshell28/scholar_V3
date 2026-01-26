import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Discovery from './pages/Discovery';
import Communities from './pages/Communities';
import { Scholarships } from './pages/ScholarshipsNew';
import Recipes from './pages/Recipes';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import { Subscribe } from './pages/Subscribe';
import { UniversityPartnerDashboard } from './pages/UniversityDashboard';
import { analytics } from './services/analytics';
import { useEffect } from 'react';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    analytics.init();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Toaster position="top-center" />
        
        {isAuthenticated && <Navigation />}
        
        <main className={isAuthenticated ? "pb-16 md:pb-0" : ""}>
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            <Route
              path="/"
              element={isAuthenticated ? <Home /> : <Navigate to="/landing" />}
            />
            
            <Route
              path="/discover"
              element={isAuthenticated ? <Discovery /> : <Navigate to="/login" />}
            />
            
            <Route
              path="/communities"
              element={isAuthenticated ? <Communities /> : <Navigate to="/login" />}
            />
            
            <Route
              path="/scholarships"
              element={isAuthenticated ? <Scholarships /> : <Navigate to="/login" />}
            />
            
            <Route
              path="/subscribe"
              element={isAuthenticated ? <Subscribe /> : <Navigate to="/login" />}
            />
            
            <Route
              path="/university-dashboard"
              element={isAuthenticated ? <UniversityPartnerDashboard /> : <Navigate to="/login" />}
            />
            
            <Route
              path="/recipes"
              element={isAuthenticated ? <Recipes /> : <Navigate to="/login" />}
            />
            
            <Route
              path="/chat"
              element={isAuthenticated ? <Chat /> : <Navigate to="/login" />}
            />
            
            <Route
              path="/notifications"
              element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />}
            />
            
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
