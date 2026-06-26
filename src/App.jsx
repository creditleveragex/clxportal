import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.jsx';
import Login from './pages/Login.jsx';
import { useAuth } from './hooks/useAuth.js';

function userFromSession(session) {
  if (!session?.user) return null;
  const metadata = session.user.user_metadata ?? {};
  return {
    name: metadata.full_name ?? metadata.name ?? session.user.email ?? 'Unknown User',
    role: metadata.role ?? 'Member',
  };
}

function RequireAuth({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--clx-text-secondary)' }}>Loading...</div>;
  }
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children(session);
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>{(session) => <MainLayout user={userFromSession(session)} />}</RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
