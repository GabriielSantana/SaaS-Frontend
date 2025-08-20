// src/components/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Criaremos este arquivo a seguir

const API_BASE_URL = 'http://localhost:5000';

// Ícones simples para os cards
const IconeCalendario = () => <span>📅</span>;
const IconeDinheiro = () => <span>💰</span>;
const IconeEstrela = () => <span>⭐</span>;

const Dashboard = ({ setMensagem }) => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Falha ao carregar estatísticas.');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error(error);
                setMensagem({ texto: error.message, tipo: 'erro' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [setMensagem]);

    if (isLoading) {
        return <div className="loading-container">Carregando dashboard...</div>;
    }

    if (!stats) {
        return <div className="admin-card">Não foi possível carregar os dados do dashboard.</div>
    }

    return (
        <div className="dashboard-grid">
            <div className="dashboard-card">
                <div className="card-icon"><IconeCalendario /></div>
                <div className="card-content">
                    <h3>Agendamentos Hoje</h3>
                    <p className="card-value">{stats.agendamentosHoje}</p>
                </div>
            </div>

            <div className="dashboard-card">
                <div className="card-icon"><IconeDinheiro /></div>
                <div className="card-content">
                    <h3>Faturamento do Mês</h3>
                    <p className="card-value">R$ {parseFloat(stats.faturamentoMes).toFixed(2)}</p>
                </div>
            </div>

            <div className="dashboard-card">
                <div className="card-icon"><IconeEstrela /></div>
                <div className="card-content">
                    <h3>Serviço Popular</h3>
                    <p className="card-value">{stats.servicoMaisAgendado}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;