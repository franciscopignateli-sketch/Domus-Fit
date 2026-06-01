// src/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
  const userString = localStorage.getItem('domus_user');

  // Se NÃO estiver logado, faz o redirect imediato para o /login
  if (!userString) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userString);

  // Se a rota exige um cargo específico (ex: 'admin') e o user não o tem
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />; // Manda de volta para a Home
  }

  // Se estiver logado e tiver as permissões certas, mostra a página protegida
  return children;
}

export default ProtectedRoute;