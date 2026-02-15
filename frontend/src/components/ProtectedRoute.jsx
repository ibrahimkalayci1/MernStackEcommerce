import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin, user }) => {
  const token = localStorage.getItem('token')

  if(isAdmin && user?.user?.role == 'admin'){
  return  <Outlet/> 
  }
  
  if(!isAdmin && token){
    return <Outlet/>
  }
  
  
  <Navigate to="/" />
};

export default ProtectedRoute;
