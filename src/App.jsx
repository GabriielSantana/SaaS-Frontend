// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmpresaRegistro from './components/EmpresaRegistro';
import EmpresaLogin from './components/EmpresaLogin';
import PainelAdmin from './components/PainelAdmin';
import TelaCliente from './components/TelaCliente';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword'; 
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
         <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path="/agendamento/:slug" element={<TelaCliente />} />
          <Route path="/registro" element={<EmpresaRegistro />} />
          <Route path="/login" element={<EmpresaLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />   
          <Route path="/email-verificado" element={<EmailVerificado />} />
          <Route path="/verificacao-falhou" element={<VerificacaoFalhou />} />       
          <Route 
            path="/painel" 
            element={
              <ProtectedRoute>
                <PainelAdmin />
              </ProtectedRoute>
            } 
          />
         <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;