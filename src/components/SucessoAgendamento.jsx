import React from 'react';
import { Link } from 'react-router-dom';
import './StatusAgendamento.css'; // Usaremos o mesmo CSS para ambas as páginas

const SucessoAgendamento = () => {
    return (
        <div className="status-container success">
            <div className="status-card">
                <div className="status-icon success-icon">✓</div>
                <h1>Pagamento Aprovado!</h1>
                <p>Seu agendamento foi confirmado com sucesso. Você receberá um e-mail com todos os detalhes em breve.</p>
                <Link to="/" className="btn-voltar">Voltar para a Página Inicial</Link>
            </div>
        </div>
    );
};

export default SucessoAgendamento;