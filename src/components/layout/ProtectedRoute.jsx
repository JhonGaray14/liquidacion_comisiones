import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data/roles';

export default function ProtectedRoute({ children, module }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const allowed = ROLES[user.rol]?.nav.includes(module);
  if (!allowed) return <Navigate to="/dashboard" replace />;

  return children;
}