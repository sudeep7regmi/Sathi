import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AppShell from './components/AppShell.jsx';
import { Spinner } from './components/ui.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Player
import PlayerHome from './pages/player/PlayerHome.jsx';
import Discover from './pages/player/Discover.jsx';
import MatchDetail from './pages/player/MatchDetail.jsx';
import CreateMatch from './pages/player/CreateMatch.jsx';
import Bookings from './pages/player/Bookings.jsx';
import Notifications from './pages/player/Notifications.jsx';
import Chat from './pages/player/Chat.jsx';
import Scorer from './pages/player/Scorer.jsx';

// Owner
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx';
import OwnerBookings from './pages/owner/OwnerBookings.jsx';
import OwnerCourts from './pages/owner/OwnerCourts.jsx';

// Admin
import AdminOverview from './pages/admin/AdminOverview.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminVerifications from './pages/admin/AdminVerifications.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen grid place-items-center"><Spinner label="Loading Sathi…" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <AppShell>{children}</AppShell>;
}

// Role-aware home + section routes
function RoleRoutes() {
  const { user } = useAuth();
  if (user.role === 'owner') {
    return (
      <Routes>
        <Route index element={<OwnerDashboard />} />
        <Route path="bookings" element={<OwnerBookings />} />
        <Route path="courts" element={<OwnerCourts />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    );
  }
  if (user.role === 'admin') {
    return (
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="verifications" element={<AdminVerifications />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    );
  }
  // player
  return (
    <Routes>
      <Route index element={<PlayerHome />} />
      <Route path="discover" element={<Discover />} />
      <Route path="create" element={<CreateMatch />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="matches/:id" element={<MatchDetail />} />
      <Route path="matches/:id/chat" element={<Chat />} />
      <Route path="matches/:id/score" element={<Scorer />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}

function Gate() {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen grid place-items-center"><Spinner label="Loading Sathi…" /></div>;
  return user ? <Navigate to="/app" replace /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Gate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app/*" element={<Protected><RoleRoutes /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
