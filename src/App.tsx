import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useChatStore } from './stores/chatStore';
import Navigation from './components/Navigation';
import { ToastContainer } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineBanner, OnlineBanner } from './components/OfflineBanner';
import { OnboardingTour, scholarOnboardingSteps } from './components/OnboardingTour';
import CookieConsent from './components/CookieConsent';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Discovery from './pages/Discovery';
import Communities from './pages/Communities';
import CommunityDetail from './pages/CommunityDetail';
import CreateCommunity from './pages/CreateCommunity';
import { Scholarships } from './pages/ScholarshipsNew';
import Recipes from './pages/Recipes';
import ChatWithGroups from './pages/ChatWithGroups';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import { Subscribe } from './pages/Subscribe';
import { UniversityPartnerDashboard } from './pages/UniversityDashboard';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import Mentorship from './pages/Mentorship';
import AlumniNetwork from './pages/AlumniNetwork';
import { analytics } from './services/analytics';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const { initializeSocket, disconnectSocket } = useChatStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    analytics.init();
  }, []);

  // Initialize socket when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      initializeSocket(token);
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, token]);

  // Show onboarding when user first logs in
  useEffect(() => {
    if (isAuthenticated) {
      setShowOnboarding(true);
    }
  }, [isAuthenticated]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <ToastContainer />
          <OfflineBanner />
          <OnlineBanner />
          <CookieConsent />
          
          {isAuthenticated && (
            <>
              <Navigation />
              <OnboardingTour
                steps={scholarOnboardingSteps}
                onComplete={() => setShowOnboarding(false)}
                storageKey="scholar_onboarding_v1"
              />
            </>
          )}
          
          <main className={isAuthenticated ? "pb-16 md:pb-0" : ""}>
            <AnimatedRoutes isAuthenticated={isAuthenticated} />
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

function AnimatedRoutes({ isAuthenticated }: { isAuthenticated: boolean }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          {/* Public routes */}
          <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/home" />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
          
          {/* Protected routes */}
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
          <Route path="/discover" element={isAuthenticated ? <Discovery /> : <Navigate to="/login" />} />
          <Route path="/communities" element={isAuthenticated ? <Communities /> : <Navigate to="/login" />} />
          <Route path="/communities/create" element={isAuthenticated ? <CreateCommunity /> : <Navigate to="/login" />} />
          <Route path="/communities/:id" element={isAuthenticated ? <CommunityDetail /> : <Navigate to="/login" />} />
          <Route path="/scholarships" element={isAuthenticated ? <Scholarships /> : <Navigate to="/login" />} />
          <Route path="/subscribe" element={isAuthenticated ? <Subscribe /> : <Navigate to="/login" />} />
          <Route path="/university-dashboard" element={isAuthenticated ? <UniversityPartnerDashboard /> : <Navigate to="/login" />} />
          <Route path="/recipes" element={isAuthenticated ? <Recipes /> : <Navigate to="/login" />} />
          <Route path="/events" element={isAuthenticated ? <Events /> : <Navigate to="/login" />} />
          <Route path="/events/create" element={isAuthenticated ? <CreateEvent /> : <Navigate to="/login" />} />
          <Route path="/mentorship" element={isAuthenticated ? <Mentorship /> : <Navigate to="/login" />} />
          <Route path="/alumni" element={isAuthenticated ? <AlumniNetwork /> : <Navigate to="/login" />} />
          <Route path="/chat" element={isAuthenticated ? <ChatWithGroups /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
export default App;
