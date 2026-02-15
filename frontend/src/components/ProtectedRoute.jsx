import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin }) => {
  const token = localStorage.getItem('token');
  const { user, loading } = useSelector((state) => state.user);

  if (isAdmin) {
    // Token var ama profile henüz dönmediyse veya yükleniyorsa bekle (sayfa yenilemede atmasın)
    if (token && (loading || !user?.user)) {
      return (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      );
    }
    if (user?.user?.role === 'admin') return <Outlet />;
    return <Navigate to="/" replace />;
  }

  if (token) return <Outlet />;
  return <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
