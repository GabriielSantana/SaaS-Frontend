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
            const response = await fetch(`${API_BASE_URL}/admin/create-portal-session`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
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

    const isContaAdmin = !assinatura.stripe_customer_id;

    return (
        <div className="admin-card">
            <h2>Minha Assinatura</h2>
            <div className="assinatura-status">
                <p>Status: <span className={statusInfo[assinatura.status_assinatura]?.classe || ''}>{statusInfo[assinatura.status_assinatura]?.texto || 'Desconhecido'}</span></p>
                <p>Próximo Vencimento: <strong>{isContaAdmin ? 'Vitalício (Admin)' : new Date(assinatura.data_vencimento).toLocaleDateString()}</strong></p>
            </div>
            
            <div className="instrucoes-pagamento">
                <h3>Gerir Assinatura</h3>
                {isContaAdmin ? (
                    <p>Esta é uma conta de administrador com acesso isento. Não é necessário gerir uma fatura.</p>
                ) : (
                    <>
                        <p>Para atualizar o seu método de pagamento, ver o histórico de faturas ou cancelar a sua assinatura, aceda ao nosso portal seguro.</p>
                        <button 
                            className="btn-primary" 
                            onClick={handleManageSubscription} 
                            disabled={isLoading}
                        >
                            {isLoading ? 'A carregar...' : 'Gerir Fatura e Pagamento'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AbaAssinatura;