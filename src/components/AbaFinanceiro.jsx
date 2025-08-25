import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../api';
import './AbaFinanceiro.css';

const AbaFinanceiro = () => {
    const [assinatura, setAssinatura] = useState(null);
    const [isStripeConnected, setIsStripeConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Lógica para verificar se a conta é de administrador
    const empresaLogada = JSON.parse(localStorage.getItem('empresa'));
    const isContaAdmin = empresaLogada && (empresaLogada.id === 1 || empresaLogada.id === 2);

    useEffect(() => {
        const fetchDadosFinanceiros = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const [assinaturaRes, stripeStatusRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/admin/minha-assinatura`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/admin/stripe/account-status`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (assinaturaRes.ok) setAssinatura(await assinaturaRes.json());
                if (stripeStatusRes.ok) setIsStripeConnected((await stripeStatusRes.json()).isConnected);

            } catch (error) {
                toast.error("Erro ao carregar dados financeiros.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDadosFinanceiros();
    }, []);

    // Função para INICIAR uma nova assinatura
    const handleCreateCheckoutSession = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/admin/create-checkout-session`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok && data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.message || "Erro ao iniciar assinatura.");
            }
        } catch (error) {
            toast.error(`Erro: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para GERENCIAR uma assinatura existente
    const handleManageSubscription = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/admin/create-portal-session`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok && data.url) {
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

    // Função para conectar a conta para RECEBIMENTOS
    const handleConnectStripeAccount = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/admin/stripe/connect-onboarding`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error("Não foi possível gerar o link de conexão. Tente novamente.");
            }
        } catch (error) {
            toast.error("Erro de conexão ao tentar conectar com a Stripe.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !assinatura) {
        return <div className="admin-card"><h2>Carregando informações financeiras...</h2></div>;
    }

    const statusInfo = {
        'ativa': { classe: 'status-ativo', texto: 'Ativa' },
        'pendente': { classe: 'status-pendente', texto: 'Pendente' },
        'inativa': { classe: 'status-inativo', texto: 'Inativa' },
    };
    const statusAtual = statusInfo[assinatura.status_assinatura] || { classe: '', texto: 'Desconhecido' };

    return (
        <div className="financeiro-container">
            {/* CARD 1: ASSINATURA DA PLATAFORMA */}
            <div className="admin-card">
                <h2>Assinatura G2Plannix</h2>
                <div className={`status-assinatura ${statusAtual.classe}`}>
                    <p><strong>Status:</strong> {statusAtual.texto}</p>
                    <p><strong>Vencimento:</strong> {isContaAdmin ? 'Vitalício (Admin)' : new Date(assinatura.data_vencimento).toLocaleDateString('pt-BR')}</p>
                </div>
                
                {isContaAdmin ? (
                    <p className="aviso-admin">Esta é uma conta de administrador com acesso vitalício.</p>
                ) : (
                    assinatura.status_assinatura === 'ativa' ? (
                        <button onClick={handleManageSubscription} className="btn-secondary" disabled={isLoading}>
                            {isLoading ? 'Carregando...' : 'Gerenciar Fatura e Pagamento'}
                        </button>
                    ) : (
                        <>
                            <p>Sua assinatura não está ativa. Ative para usar todos os recursos da plataforma.</p>
                            <button onClick={handleCreateCheckoutSession} className="btn-primary" disabled={isLoading}>
                                {isLoading ? 'Carregando...' : 'Ativar Assinatura'}
                            </button>
                        </>
                    )
                )}
            </div>

            {/* CARD 2: CONEXÃO PARA RECEBER PAGAMENTOS */}
            <div className="admin-card">
                <h2>Recebimentos de Clientes</h2>
                {isStripeConnected ? (
                    <div className="status-conexao conectado">
                        <h3>✅ Tudo pronto para receber!</h3>
                        <p>Sua conta está conectada e você já pode configurar serviços para exigir pagamento antecipado dos seus clientes.</p>
                    </div>
                ) : (
                    <div className="status-conexao desconectado">
                        <h3>⚠️ Conecte sua conta para receber pagamentos</h3>
                        <p>Para aceitar pagamentos com cartão de crédito, você precisa conectar sua conta ao nosso sistema de pagamentos seguro (Stripe).</p>
                        <button onClick={handleConnectStripeAccount} className="btn-primary" disabled={isLoading}>
                            {isLoading ? 'Carregando...' : 'Conectar Conta para Recebimentos'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AbaFinanceiro;