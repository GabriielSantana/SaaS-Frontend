// src/components/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './EmpresaLogin.css';

const API_BASE_URL = 'http://localhost:5000';

const ResetPassword = () => {
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const { token } = useParams(); // Pega o token da URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (senha !== confirmarSenha) {
            setMensagem({ texto: 'As senhas não coincidem.', tipo: 'erro' });
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/password/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senha }),
            });
            const result = await response.json();
            if (response.ok) {
                setMensagem({ texto: result.message, tipo: 'sucesso' });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setMensagem({ texto: result.message, tipo: 'erro' });
            }
        } catch (error) {
            setMensagem({ texto: 'Erro de conexão.', tipo: 'erro' });
        }
    };

    return (
        <div className="login-container">
            <div className="card">
                <h1>Criar Nova Senha</h1>
                <p>Digite e confirme sua nova senha abaixo.</p>
                {mensagem.texto && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}
                <form onSubmit={handleSubmit} className="login-form">
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Nova senha" required />
                    <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Confirmar nova senha" required />
                    <button type="submit" className="btn-login">Redefinir Senha</button>
                </form>
            </div>
        </div>
    );
};
export default ResetPassword;