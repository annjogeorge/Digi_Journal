import { Routes, Route, useNavigate } from 'react-router-dom';
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

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/welcome" element={<Landing onGetStarted={() => navigate('/')} />} />
      <Route path="/landing" element={<Landing onGetStarted={() => navigate('/')} />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/todo" element={<Todo />} />
      <Route path="/future-me" element={<FutureMe />} />
      <Route path="/stats" element={<Statistics />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/suggestions" element={<Suggestions />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;