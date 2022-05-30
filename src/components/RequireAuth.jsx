import { Navigate, Outlet, useLocation } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

function RequireAuth({ allowedRoles }) {
  const { auth } = useAuth();
  const location = useLocation();
  return auth.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to={{ pathname: '/unauthorized', state: { from: location } }} />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;
