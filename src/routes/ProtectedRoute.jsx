// src/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Verifica se o utilizador está guardado no localStorage
  const userExists = localStorage.getItem('domus_user');

  // Se NÃO estiver logado, faz o redirect imediato para o /login
  if (!userExists) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, mostra a página protegida (o Perfil)
  return children;
}

export default ProtectedRoute;