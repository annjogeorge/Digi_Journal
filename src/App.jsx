import { Routes, Route, useNavigate } from 'react-router-dom';
import { useJournal } from './context/JournalContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Todo from './pages/Todo';
import FutureMe from './pages/FutureMe';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Suggestions from './pages/Suggestions';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import CheckEmail from './pages/auth/CheckEmail';
import AuthCallback from './pages/auth/AuthCallback';

function App() {
  const navigate = useNavigate();
  const { user, authLoading } = useJournal();

  // Prevent flicker, wrong-page flash, or hydration glitch while authentication resolves
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#242262] bg-grid flex flex-col items-center justify-center text-white select-none">
        <div className="w-8 h-8 border-2 border-black bg-[#f3df23] shadow-[3px_3px_0px_#000] animate-bounce mb-3" />
        <div className="font-pixel text-xs text-[#f3df23] tracking-widest uppercase animate-pulse">
          INITIALIZING DIGIJOURNAL...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root route: public landing page for visitors, dashboard for authenticated users */}
      <Route
        path="/"
        element={
          user ? (
            <Dashboard />
          ) : (
            <Landing onGetStarted={() => navigate('/journal')} />
          )
        }
      />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/landing"
        element={<Landing onGetStarted={() => navigate(user ? '/dashboard' : '/journal')} />}
      />
      <Route
        path="/welcome"
        element={<Landing onGetStarted={() => navigate(user ? '/dashboard' : '/journal')} />}
      />
      <Route path="/journal" element={<Journal />} />
      <Route path="/todo" element={<Todo />} />
      <Route path="/future-me" element={<FutureMe />} />
      <Route path="/stats" element={<Statistics />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/suggestions" element={<Suggestions />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;