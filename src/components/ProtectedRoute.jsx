import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
        // Se não estiver autenticado, redireciona para a página de login
        return <Navigate to="/login" replace />;
    }

    // Se estiver autenticado, renderiza o componente da rota (ex: PainelAdmin)
    return children;
};

export default ProtectedRoute;