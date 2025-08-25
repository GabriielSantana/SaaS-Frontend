import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../api'; // Importe sua URL base da API
import './ConfiguracoesPagamento.css'; // Criaremos este CSS a seguir

const ConfiguracoesPagamento = () => {
    const [config, setConfig] = useState({
        aceita_pagamento_antecipado: false,
        politica_cancelamento_horas: 24,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/admin/configuracoes/pagamento`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setConfig(data);
                } else {
                    toast.error("Erro ao carregar as configurações.");
                }
            } catch (error) {
                toast.error("Erro de conexão ao carregar configurações.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : parseInt(value, 10)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/admin/configuracoes/pagamento`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(config)
            });

            if (response.ok) {
                toast.success("Configurações salvas com sucesso!");
            } else {
                toast.error("Erro ao salvar as configurações.");
            }
        } catch (error) {
            toast.error("Erro de conexão ao salvar configurações.");
        }
    };

    if (isLoading) {
        return <div>Carregando configurações...</div>;
    }

    return (
        <div className="config-pagamento-container">
            <h2>Configurações de Pagamento Antecipado</h2>
            <form onSubmit={handleSubmit} className="config-form">
                <div className="form-group-toggle">
                    <label htmlFor="aceita_pagamento_antecipado">
                        Ativar pagamento antecipado nos agendamentos?
                    </label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            id="aceita_pagamento_antecipado"
                            name="aceita_pagamento_antecipado"
                            checked={config.aceita_pagamento_antecipado}
                            onChange={handleChange}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                <div className={`form-group-policy ${!config.aceita_pagamento_antecipado ? 'disabled' : ''}`}>
                    <label htmlFor="politica_cancelamento_horas">
                        Política de Cancelamento com Reembolso
                    </label>
                    <p className="description">
                        O cliente poderá cancelar e ser reembolsado até
                        <input
                            type="number"
                            id="politica_cancelamento_horas"
                            name="politica_cancelamento_horas"
                            value={config.politica_cancelamento_horas}
                            onChange={handleChange}
                            min="0"
                            disabled={!config.aceita_pagamento_antecipado}
                        />
                        horas antes do agendamento.
                    </p>
                </div>
                
                <button type="submit" className="btn-salvar-config">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default ConfiguracoesPagamento;