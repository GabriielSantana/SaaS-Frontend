import React from 'react';
import { Link } from 'react-router-dom';
import './StatusAgendamento.css';

const CancelamentoAgendamento = () => {
    return (
        <div className="status-container cancel">
            <div className="status-card">
                <div className="status-icon cancel-icon">!</div>
                <h1>Pagamento Cancelado</h1>
                <p>O processo de pagamento foi cancelado ou falhou. Seu agendamento **não foi realizado**.</p>
                <p>Por favor, tente novamente ou entre em contato com a empresa.</p>
                {/* Você pode adicionar um link para voltar à página de agendamento específica se tiver o slug */}
                <Link to="/" className="btn-voltar">Tentar Novamente</Link>
            </div>
        </div>
    );
};

export default CancelamentoAgendamento;