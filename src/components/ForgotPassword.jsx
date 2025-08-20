// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// (Reutilize o CSS da tela de login se desejar)
import './EmpresaLogin.css';

const API_BASE_URL = 'http://localhost:5000';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ texto: 'Processando...', tipo: 'processando' });
        try {
            const response = await fetch(`${API_BASE_URL}/password/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const result = await response.json();
            setMensagem({ texto: result.message, tipo: 'sucesso' });
        } catch (error) {
            setMensagem({ texto: 'Erro de conexão.', tipo: 'erro' });
        }
    };

    return (
        <div className="login-container">
            <div className="card">
                <h1>Recuperar Senha</h1>
                <p>Digite seu e-mail e enviaremos um link para redefinir sua senha.</p>
                {mensagem.texto && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}
                <form onSubmit={handleSubmit} className="login-form">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu e-mail" required />
                    <button type="submit" className="btn-login">Enviar Link</button>
                </form>
                <div className="link-container">
                    <p><Link to="/login" className="link-registro">Voltar para o Login</Link></p>
                </div>
            </div>
        </div>
    );
};
export default ForgotPassword;