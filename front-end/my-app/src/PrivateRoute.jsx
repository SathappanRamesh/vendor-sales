import { Navigate } from 'react-router-dom';
import { useEffect, useState} from 'react';
const PrivateRoute = ({ children }) => {


 const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") || null
  );

  useEffect(() => {
  if(!isAuthenticated) {
      window.location.reload();
  }
  }, [isAuthenticated]);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
