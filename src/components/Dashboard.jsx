import React, { useState, useEffect } from 'react';
import './Dashboard.css'; 
import DatePicker from 'react-datepicker' 
import 'react-datepicker/dist/react-datepicker.css'

import { API_BASE_URL } from '../api';

const Dashboard = ({ agendamentos }) => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  // A lógica de filtro que já tínhamos
const agendamentosFiltrados = agendamentos.filter((ag) => {
  // Formata a data do agendamento vinda do banco em UTC
  const dataAgendamento = new Date(ag.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  // Formata a data selecionada no calendário também em UTC para garantir a comparação correta
  const dataFiltro = dataSelecionada.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  return dataAgendamento === dataFiltro && ag.status === 'confirmado';
});

  // 1. Cálculo do Faturamento do Dia
    const faturamentoDoDia = agendamentosFiltrados.reduce((total, ag) => {
    const precoServico = parseFloat(ag.preco_servico || 0);
    return total + precoServico;
  }, 0);

  // 2. Cálculo do Serviço Mais Popular do Dia
  const servicoMaisPopularDoDia = () => {
    if (agendamentosFiltrados.length === 0) {
      return 'Nenhum';
    }

    const contagemServicos = agendamentosFiltrados.reduce((acc, ag) => {
      acc[ag.nome_servico] = (acc[ag.nome_servico] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(contagemServicos).reduce((a, b) =>
      contagemServicos[a] > contagemServicos[b] ? a : b
    );
  };

  return (
    <div className="admin-card">
      <div className="dashboard-header">
        <h3>
          Resumo de{' '}
          {dataSelecionada.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </h3>
        <div className="date-picker-container" id="date-dashboard">
          <label>Selecionar outra data:</label>
          <DatePicker
            selected={dataSelecionada}
            onChange={(date) => setDataSelecionada(date)}
            dateFormat="dd/MM/yyyy"
            className="custom-datepicker"
          />
        </div>
      </div>

      {/* Grid para as métricas do dia */}
      <div className="dashboard-grid-diario">
        <div className="dashboard-card-diario">
          <h4>Agendamentos no Dia</h4>
          <p>{agendamentosFiltrados.length}</p>
        </div>
        <div className="dashboard-card-diario">
          <h4>Faturamento no Dia</h4>
          <p>R$ {faturamentoDoDia.toFixed(2)}</p>
        </div>
        <div className="dashboard-card-diario">
          <h4>Serviço Popular do Dia</h4>
          <p>{servicoMaisPopularDoDia()}</p>
        </div>
      </div>

      <h4 className="titulo-lista-agendamentos">
        Agendamentos do Dia
      </h4>

            <div className="lista-agendamentos-dashboard">
                {agendamentosFiltrados.length > 0 ? (
                    <ul>
                    {agendamentosFiltrados.map((ag) => (
                        <li key={ag.id}>
                        <div className="info-item">
                            <span className="label">Horário</span>
                            <span className="value horario">{ag.hora.substring(0, 5)}</span>
                        </div>

                        <div className="info-item">
                            <span className="label">Cliente</span>
                            <span className="value">{ag.nome_cliente}</span>
                        </div>

                        <div className="info-item">
                            <span className="label">Serviço</span>
                            <span className="value servico">{ag.nome_servico}</span>
                        </div>

                        <div className="info-item">
                            <span className="label">Valor</span>
                            <span className="value valor">R$ {parseFloat(ag.preco_servico).toFixed(2)}</span>
                        </div>

                        <div className="info-item status-container">
                            <span className="label">Status</span>
                            <span className={`status-tag ${ag.status}`}>{ag.status}</span>
                        </div>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="nenhum-agendamento">
                    Nenhum agendamento confirmado para esta data.
                    </p>
                )}
        </div>
    </div>
  );
};


export default Dashboard;