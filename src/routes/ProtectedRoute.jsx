import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
  const userString = localStorage.getItem('domus_user');

  // Prevenção de acessos via manipulação direta do URL no browser
  if (!userString) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userString);

  // Implementação de RBAC (Role-Based Access Control)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />; 
  }

  return children;
}

export default ProtectedRoute;