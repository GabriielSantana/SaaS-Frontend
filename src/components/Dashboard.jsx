import React, { useState, useEffect } from 'react';
import './Dashboard.css'; 
import DatePicker from 'react-datepicker' 
import 'react-datepicker/dist/react-datepicker.css'

import { API_BASE_URL } from '../api';

const Dashboard = ({ agendamentos }) => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  // A lógica de filtro que já tínhamos
  const agendamentosFiltrados = agendamentos.filter((ag) => {
    const dataAgendamento = new Date(ag.data).toLocaleDateString();
    const dataFiltro = dataSelecionada.toLocaleDateString();
    return dataAgendamento === dataFiltro && ag.status === 'confirmado'; // Considera apenas agendamentos confirmados
  });


  // 1. Cálculo do Faturamento do Dia
    const faturamentoDoDia = agendamentosFiltrados.reduce((total, ag) => {
    const precoServico = parseFloat(preco || 0); // Use o nome correto da propriedade do preço
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
        <div className="date-picker-container">
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
                <span className="horario">{ag.hora.substring(0, 5)}</span>
                <span className="cliente">{ag.nome_cliente}</span>
                <span className="servico">{ag.nome_servico}</span>
                <span className={`status-tag ${ag.status}`}>{ag.status}</span>
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