import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../api'; // Usa a configuração central
import './PainelAdmin.css';

const AbaAssinatura = () => {
    const [assinatura, setAssinatura] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAssinatura = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_BASE_URL}/admin/minha-assinatura`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setAssinatura(await res.json());
                }
            } catch (error) { console.error(error); }
        };
        fetchAssinatura();
    }, []);

    const handleManageSubscription = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/pagamentos/create-portal-session`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                // Redireciona o utilizador para o Portal do Cliente da Stripe
                window.location.href = data.url;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(`Erro ao abrir o portal: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!assinatura) return <div>Carregando informações da assinatura...</div>;

    const statusInfo = {
        'ativa': { classe: 'status-ativo', texto: 'Ativa' },
        'pendente': { classe: 'status-pendente', texto: 'Pendente' },
        'inativa': { classe: 'status-inativo', texto: 'Inativa' },
    };

    return (
        <div className="admin-card">
            <h2>Minha Assinatura</h2>
            <div className="assinatura-status">
                <p>Status: <span className={statusInfo[assinatura.status_assinatura]?.classe || ''}>{statusInfo[assinatura.status_assinatura]?.texto || 'Desconhecido'}</span></p>
                <p>Próximo Vencimento: <strong>{assinatura.data_vencimento ? new Date(assinatura.data_vencimento).toLocaleDateString() : '...'}</strong></p>
            </div>
            <div className="instrucoes-pagamento">
                <h3>Gerir Assinatura</h3>
                <p>Para atualizar o seu método de pagamento, ver o histórico de faturas ou cancelar a sua assinatura, aceda ao nosso portal seguro.</p>
                <button 
                    className="btn-primary" 
                    onClick={handleManageSubscription} 
                    disabled={isLoading}
                >
                    {isLoading ? 'A carregar...' : 'Gerir Fatura e Pagamento'}
                </button>
            </div>
        </div>
    );
};

export default AbaAssinatura;