import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Todo from './pages/Todo';
import FutureMe from './pages/FutureMe';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/todo" element={<Todo />} />
      <Route path="/future-me" element={<FutureMe />} />
      <Route path="/stats" element={<Statistics />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;