import React, { useState, useEffect } from 'react';
import './HorariosCliente.css'; 

const API_BASE_URL = 'http://localhost:5000';

const HorariosCliente = ({ empresaId }) => {
  const [horarios, setHorarios] = useState({});
  const [loading, setLoading] = useState(true);

  const diasDaSemanaMap = {
    'segunda': 'Segunda-feira',
    'terca': 'Terça-feira',
    'quarta': 'Quarta-feira',
    'quinta': 'Quinta-feira',
    'sexta': 'Sexta-feira',
    'sabado': 'Sábado',
    'domingo': 'Domingo',
  };

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/empresas/${empresaId}/horarios`);
        const data = await response.json();
        setHorarios(data);
      } catch (error) {
        console.error('Erro ao buscar horários:', error);
      } finally {
        setLoading(false);
      }
    };

    if (empresaId) {
      fetchHorarios();
    }
  }, [empresaId]);

  if (loading) {
    return <div>Carregando horários...</div>;
  }

  return (
    <div className="horarios-cliente-container">
      <h2>Horários de Atendimento</h2>
      <ul className="horarios-lista">
        {Object.keys(diasDaSemanaMap).map(dia => {
          const horariosDoDia = horarios[dia];
          return (
            <li key={dia} className="horario-dia">
              <span className="dia-semana">{diasDaSemanaMap[dia]}:</span>
              <div className="horario-intervalos">
                {horariosDoDia && horariosDoDia.length > 0 ? (
                  horariosDoDia.map((horario, index) => (
                    <span key={index} className="horario-intervalo">{horario.hora_inicio} - {horario.hora_termino}</span>
                  ))
                ) : (
                  <span className="dia-sem-expediente">Dia sem expediente.</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HorariosCliente;