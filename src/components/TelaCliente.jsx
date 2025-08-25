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
    const [agendamentoInfo, setAgendamentoInfo] = useState({ nome_cliente: '', email_cliente: '', telefone_cliente: '' });
    const [errors, setErrors] = useState({});
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

     const validate = () => {
        const tempErrors = {};
        
        // Validação de Nome
        if (!agendamentoInfo.nome_cliente.trim()) {
            tempErrors.nome_cliente = "O nome é obrigatório.";
        }

        // Validação de E-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!agendamentoInfo.email_cliente || !emailRegex.test(agendamentoInfo.email_cliente)) {
            tempErrors.email_cliente = "Por favor, insira um e-mail válido.";
        }

        // Validação de Telefone (padrão brasileiro, com DDD + 9 dígitos)
        const telefoneRegex = /^\(?\d{2}\)?\s?9\d{4}-?\d{4}$/;
        if (!agendamentoInfo.telefone_cliente || !telefoneRegex.test(agendamentoInfo.telefone_cliente.replace(/\s/g, ''))) {
            tempErrors.telefone_cliente = "Insira um WhatsApp válido (DDD + 9 dígitos).";
        }
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
    e.preventDefault();

    // A validação continua a mesma
    if (!validate()) {
        toast.warn('Por favor, corrija os erros no formulário.');
        return;
    }

    setIsLoading(true);

    const agendamentoParaEnviar = {
        empresa_id: empresa.id,
        servico_id: servicoSelecionado.id,
        data: dataSelecionada.toISOString().split('T')[0],
        hora: horaSelecionada,
        ...agendamentoInfo
    };

    try {
        const token = localStorage.getItem('token'); // Pode ser útil no futuro
        const response = await fetch(`${API_BASE_URL}/public/agendamentos`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}` // Descomente se a rota precisar de autenticação
            },
            body: JSON.stringify(agendamentoParaEnviar),
        });
        
        const result = await response.json();

        if (!response.ok) {
            toast.error(result.message || 'Erro ao processar o agendamento.');
            setIsLoading(false);
            return;
        }

        if (result.checkoutUrl) {
            // CASO 1: PAGAMENTO NECESSÁRIO
            // Se o backend retornou uma URL do Stripe, redireciona o cliente
            toast.info("Você será redirecionado para a página de pagamento seguro.");
            
            // Um pequeno delay para o usuário ler a mensagem antes de redirecionar
            setTimeout(() => {
                window.location.href = result.checkoutUrl;
            }, 2500); 

        } else {
            // CASO 2: SEM PAGAMENTO (FLUXO ANTIGO)
            // Se não, o agendamento foi criado normalmente
            toast.success(result.message || 'Agendamento realizado com sucesso!');
            // Limpa o formulário
            setServicoSelecionado(null);
            setDataSelecionada(null);
            setHoraSelecionada('');
            setAgendamentoInfo({ nome_cliente: '', email_cliente: '', telefone_cliente: '' });
            setErrors({});
            setIsLoading(false);
        }

    } catch (error) {
        toast.error('Erro de conexão com o servidor.');
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
                                <input 
                                    type="text" 
                                    id="nome_cliente" 
                                    name="nome_cliente" 
                                    value={agendamentoInfo.nome_cliente} 
                                    onChange={handleAgendamentoChange} 
                                    className={errors.nome_cliente ? 'invalid' : ''}
                                />
                                {errors.nome_cliente && <p className="error-text">{errors.nome_cliente}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email_cliente">Seu E-mail:</label>
                                <input 
                                    type="email" 
                                    id="email_cliente" 
                                    name="email_cliente" 
                                    value={agendamentoInfo.email_cliente} 
                                    onChange={handleAgendamentoChange} 
                                    className={errors.email_cliente ? 'invalid' : ''}
                                />
                                {errors.email_cliente && <p className="error-text">{errors.email_cliente}</p>}
                            </div>
                             <div className="form-group">
                                <label htmlFor="telefone_cliente">Seu WhatsApp (com DDD):</label>
                                <input 
                                    type="tel" 
                                    id="telefone_cliente" 
                                    name="telefone_cliente" 
                                    value={agendamentoInfo.telefone_cliente} 
                                    onChange={handleAgendamentoChange} 
                                    placeholder="Ex: 11987654321" 
                                    className={errors.telefone_cliente ? 'invalid' : ''}
                                />
                                {errors.telefone_cliente && <p className="error-text">{errors.telefone_cliente}</p>}
                            </div>
                            <button type="submit" className="btn-confirmar" disabled={isLoading}>
                                {isLoading ? 'Confirmando...' : 'Confirmar Agendamento'}
                            </button>
                        </>
                    )}
                   </div>
                </form>
            </div>
        </div>
    );
};

export default TelaCliente;