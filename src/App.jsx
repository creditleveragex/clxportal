import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import PartnerDashboard from './pages/PartnerDashboard.jsx';
import Login from './pages/Login.jsx';
import { useAuth } from './hooks/useAuth.js';

function RequireAuth({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--clx-text-secondary)' }}>Loading...</div>;
  }
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout>
              <PartnerDashboard />
            </Layout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
