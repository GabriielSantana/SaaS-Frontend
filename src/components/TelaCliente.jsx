import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TelaCliente.css';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../api';

const TelaCliente = () => {
    const { slug } = useParams();
    const [empresa, setEmpresa] = useState(null);
    const [servicos, setServicos] = useState([]);
    const [servicoSelecionado, setServicoSelecionado] = useState(null);
    const [dataSelecionada, setDataSelecionada] = useState(null);
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [horaSelecionada, setHoraSelecionada] = useState('');
    const [agendamentoInfo, setAgendamentoInfo] = useState({ nome_cliente: '', email_cliente: '' });
    const [abaAberta, setAbaAberta] = useState(null); 
    const [diasDisponiveis, setDiasDisponiveis] = useState([]);
    const [dataAtiva, setDataAtiva] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    // Hook para buscar dados iniciais (empresa e serviços)
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!slug) return;
            try {
                const empresaRes = await fetch(`${API_BASE_URL}/public/empresas/slug/${slug}`);
                if (empresaRes.ok) {
                    const empresaData = await empresaRes.json();
                    setEmpresa(empresaData);

                    // CORREÇÃO 1: Usa 'empresaData.id' para a busca seguinte
                    const servicosRes = await fetch(`${API_BASE_URL}/public/empresas/${empresaData.id}/servicos`);
                    if (servicosRes.ok) setServicos(await servicosRes.json());
                }
            } catch (error) {
                console.error('Erro ao buscar dados iniciais:', error);
            }
        };
        fetchInitialData();
    }, [slug]);

    // Hooks para buscar dias e horários
    useEffect(() => {
        // Só executa se tivermos a empresa e um serviço selecionado
        if (!empresa || !servicoSelecionado) return;

        const fetchDias = async () => {
            const mes = dataAtiva.getMonth() + 1;
            const ano = dataAtiva.getFullYear();
            try {
                // CORREÇÃO 2: Usa 'empresa.id' em vez de 'slug'
                const res = await fetch(`${API_BASE_URL}/public/empresas/${empresa.id}/dias-disponiveis?mes=${mes}&ano=${ano}&duracao=${servicoSelecionado.duracao_minutos}`);
                if (res.ok) setDiasDisponiveis(await res.json());
            } catch (error) { console.error("Erro ao carregar dias:", error); }
        };

        const fetchHorarios = async () => {
            if (!dataSelecionada) return;
            const dataFormatada = dataSelecionada.toISOString().split('T')[0];
            try {
                // CORREÇÃO 3: Usa 'empresa.id' em vez de 'slug'
                const url = `${API_BASE_URL}/public/empresas/${empresa.id}/horarios-disponiveis?dataCompleta=${dataFormatada}&duracao=${servicoSelecionado.duracao_minutos}`;
                const res = await fetch(url);
                if (res.ok) setHorariosDisponiveis(await res.json());
                else setHorariosDisponiveis([]);
            } catch (error) { setHorariosDisponiveis([]); }
        };

        fetchDias();
        if (dataSelecionada) {
            fetchHorarios();
        } else {
            setHorariosDisponiveis([]);
        }
    }, [empresa, servicoSelecionado, dataSelecionada, dataAtiva]);

    const isTileDisabled = ({ date, view }) => {
        if (view === 'month') {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            if (date < hoje) return true;
            const dataFormatada = date.toISOString().split('T')[0];
            return servicoSelecionado ? !diasDisponiveis.includes(dataFormatada) : true;
        }
        return false;
    };

    const handleSelecionarServico = (servico) => {
        setServicoSelecionado(servico);
        setDataSelecionada(null);
        setHorariosDisponiveis([]);
        setHoraSelecionada('');
        setAbaAberta(null);
    };

    const handleDataChange = (data) => {
        setDataSelecionada(data);
        setHoraSelecionada('');
    };
    
    const handleAgendamentoChange = (e) => {
        setAgendamentoInfo(prev => ({...prev, [e.target.name]: e.target.value}));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const dataFormatadaParaEnvio = dataSelecionada.toISOString().split('T')[0];
        
        const agendamento = {
            // CORREÇÃO 4: Usa 'empresa.id'
            empresa_id: empresa.id,
            servico_id: servicoSelecionado.id,
            data: dataFormatadaParaEnvio,
            hora: horaSelecionada,
            nome_cliente: agendamentoInfo.nome_cliente,
            email_cliente: agendamentoInfo.email_cliente,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/public/agendamentos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agendamento),
            });
            const result = await response.json();

            if (response.ok) {
                toast.success('Agendamento realizado com sucesso!');
                setServicoSelecionado(null);
                setDataSelecionada(null);
                setHoraSelecionada('');
                setAgendamentoInfo({ nome_cliente: '', email_cliente: '' });
                setHorariosDisponiveis([]);
                setDiasDisponiveis([]);
                setAbaAberta(null);
            } else {
                toast.error(result.message || 'Erro ao agendar.');
            }
        } catch (error) {
            toast.error('Erro de conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="tela-cliente-container">
             <div className="card">
                <h2>Agendamento em <span style={{color: 'rgb(18, 116, 228)'}}>{empresa ? empresa.nome : '...'}</span></h2>

                <form onSubmit={handleSubmit} className="agendamento-form">
                    {/* --- Seção de Serviço Dinâmica --- */}
                    <div className="form-group">
                        <label>Serviço:</label>
                        <div 
                            className="select-container" 
                            onClick={() => setAbaAberta(abaAberta === 'servico' ? null : 'servico')}
                        >
                            <span>{servicoSelecionado ? servicoSelecionado.nome : 'Selecione um serviço'}</span>
                            <span className={`arrow ${abaAberta === 'servico' ? 'up' : ''}`}>▼</span>
                        </div>
                        <div className={`opcoes-container ${abaAberta === 'servico' ? 'open' : ''}`}>
                            {servicos.length > 0 ? servicos.map(s => (
                                <div key={s.id} className="opcao" onClick={() => handleSelecionarServico(s)}>
                                    {s.nome} <span>(R$ {s.preco})</span>
                                </div>
                            )) : <div className="opcao-vazia">Nenhum serviço disponível.</div>}
                        </div>
                    </div>

                    {/* --- Seção de Data e Horário (Aparece após selecionar serviço) --- */}
                    <div className={`secao-calendario ${servicoSelecionado ? 'visivel' : ''}`}>
                        {servicoSelecionado && (
                            <>
                                <div className="form-group">
                                    <label>Data:</label>
                                    <Calendar
                                        onChange={handleDataChange}
                                        value={dataSelecionada}
                                        onActiveStartDateChange={({ activeStartDate }) => setDataAtiva(activeStartDate)}
                                        tileDisabled={isTileDisabled}
                                        minDate={new Date()}
                                    />
                                </div>

                                {dataSelecionada && (
                                    <div className="form-group">
                                        <label>Horários Disponíveis:</label>
                                        <div className="horarios-disponiveis">
                                            {horariosDisponiveis.length > 0 ? horariosDisponiveis.map(hora => (
                                                <button type="button" key={hora} onClick={() => setHoraSelecionada(hora)} className={horaSelecionada === hora ? 'horario-selecionado' : ''}>
                                                    {hora}
                                                </button>
                                            )) : <p>Nenhum horário disponível para esta data.</p>}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    
                    {/* --- Seção de Dados do Cliente (Aparece após selecionar horário) --- */}
                    <div className={`secao-cliente ${horaSelecionada ? 'visivel' : ''}`}>
                       {horaSelecionada && (
                         <>
                            <div className="form-group">
                                <label htmlFor="nome_cliente">Seu Nome:</label>
                                <input type="text" id="nome_cliente" name="nome_cliente" value={agendamentoInfo.nome_cliente} onChange={handleAgendamentoChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email_cliente">Seu E-mail:</label>
                                <input type="email" id="email_cliente" name="email_cliente" value={agendamentoInfo.email_cliente} onChange={handleAgendamentoChange} required />
                            </div>
                            <button type="submit" className="btn-confirmar">Confirmar Agendamento</button>
                        </>
                    )}
                   </div>
                </form>
            </div>
        </div>
    );
};

export default TelaCliente;