// src/routes/RequireAuth.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ children }) {
  const { user /*, loading*/ } = useAuth();

  // if you expose `loading` in your AuthContext, you can gate on it:
  // if (loading) return null; // or a spinner

  if (!user) return <Navigate to="/" state={{ from: useLocation() }} replace />;
  return children;
}
