import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import './PainelAdmin.css';

import { API_BASE_URL } from '../api';

// Carrega a instância do Stripe fora do componente para evitar recarregamentos
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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
            } else {
                toast.error("Não foi possível carregar os dados da assinatura.");
            }
        } catch (error) { 
            console.error(error); 
            toast.error("Erro de conexão ao buscar dados da assinatura.");
        }
    };
    fetchAssinatura();
}, []);

if (!assinatura) return <div>Carregando informações da assinatura...</div>;

const statusInfo = {
    'ativa': { classe: 'status-ativo', texto: 'Ativa' },
    'pendente': { classe: 'status-pendente', texto: 'Pendente' },
    'inativa': { classe: 'status-inativo', texto: 'Inativa' },
};

// Função para redirecionar o usuário para o checkout
const handleAssinar = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            // Chama o nosso backend para criar a sessão de checkout
            const response = await fetch(`${API_BASE_URL}/pagamentos/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Envia o token para identificar o utilizador
                }
            });

            const session = await response.json();

            if (response.ok) {
                // Redireciona o cliente para a página de pagamento da Stripe
                const stripe = await stripePromise;
                const { error } = await stripe.redirectToCheckout({
                    sessionId: session.id
                });
                if (error) {
                    toast.error(error.message);
                }
            } else {
                throw new Error(session.error.message);
            }

        } catch (error) {
            toast.error(`Erro ao iniciar pagamento: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

return (
    <div className="admin-card">
        <h2>Minha Assinatura</h2>
        <div className="assinatura-status">
            <p>Status: <span className={statusInfo[assinatura.status_assinatura]?.classe || ''}>{statusInfo[assinatura.status_assinatura]?.texto || 'Desconhecido'}</span></p>
            <p>Próximo Vencimento: <strong>{assinatura.data_vencimento ? new Date(assinatura.data_vencimento).toLocaleDateString() : 'Carregando...'}</strong></p>
        </div>

        {/* SEÇÃO DE PAGAMENTO ATUALIZADA */}
        <div className="instrucoes-pagamento">
            <h3>Gerenciar Assinatura</h3>

            {assinatura.status_assinatura === 'ativa' ? (
                <p>Sua assinatura está ativa. O próximo pagamento será cobrado automaticamente pelo Stripe</p>
            ) : (
                <>
                    <p>Sua assinatura está <strong>{statusInfo[assinatura.status_assinatura]?.texto}</strong>. Regularize o pagamento para garantir seu acesso à plataforma.</p>
                    <div className="pagamento-mercadopago">
                        <h4>Pague de forma segura com Mercado Pago</h4>
                        <p>Clique no botão abaixo para ser redirecionado e ativar sua assinatura. O acesso é liberado em poucos instantes após a confirmação.</p>
                        <button type="button" className="btn-mercado-pago" onClick={handleAssinar}>
                            Ativar ou Regularizar Assinatura
                        </button>
                    </div>
                </>
            )}
             <p className="aviso-pagamento">
                Após o pagamento, a atualização do status em nosso sistema ainda é manual. Se o seu acesso não for liberado em 24 horas, entre em contato com o suporte.
            </p>
        </div>
    </div>
);
};

export default AbaAssinatura;