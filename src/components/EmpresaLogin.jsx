// src/components/EmpresaLogin.jsx - VERSÃO CORRIGIDA

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './EmpresaLogin.css';

const API_BASE_URL = 'http://localhost:5000';

const EmpresaLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      // A URL foi corrigida para a rota de autenticação
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const result = await response.json(); // Lê a resposta (seja sucesso ou erro)

      if (response.ok) {
        const { token, empresa } = result;
        localStorage.setItem('token', token);
        localStorage.setItem('empresa', JSON.stringify(empresa));
        navigate('/painel');
      } else {
        // CORREÇÃO: Exibe a propriedade 'message' do objeto de erro
        setMensagem(result.message || 'Erro desconhecido. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      setMensagem('Erro de conexão. Verifique o servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <h1>Acesso Administrativo</h1>
        <p>Faça login para gerenciar seus serviços e agendamentos.</p>
        
        {/* A mensagem agora é um estado de string simples */}
        {mensagem && <div className="mensagem erro">{mensagem}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            className="form-input"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-input"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit" className="btn-login">Entrar</button>
        </form>
        <div className="link-container extra-links">
            <Link to="/forgot-password">Esqueceu sua senha?</Link>
        </div>
        <div className="link-container">
          <p>Não tem uma conta? <Link to="/registro" className="link-registro">Cadastre-se</Link></p>
        </div>
      </div>
    </div>
  );
};

export default EmpresaLogin;