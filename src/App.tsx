import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Analytics from './pages/Analytics';
import Applications from './pages/Applications';
import Dashboard from './pages/Dashboard';
import Interviews from './pages/Interviews';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="interviews" element={<Interviews />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
