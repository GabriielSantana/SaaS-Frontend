import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './PainelAdmin.css';
import Dashboard from './Dashboard';
import AbaAssinatura from "./AbaAssinatura";

import { API_BASE_URL } from '../api';

// ===================================================================
// == SEÇÃO DE SUB-COMPONENTES DO PAINEL ==
// ===================================================================

// (Componentes GerenciadorServicos, ListaAgendamentos, EditorHorarios, LinkAgendamento - permanecem os mesmos da versão anterior)
const GerenciadorServicos = ({ servicos, empresaId, onUpdate }) => {
    const [novoServico, setNovoServico] = useState({ nome: '', descricao: '', duracao_minutos: '', preco: '' });
    const [editingService, setEditingService] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const currentState = editingService || novoServico;
        const setter = editingService ? setEditingService : setNovoServico;
        setter({ ...currentState, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const data = editingService || novoServico;
        const url = editingService
            ? `${API_BASE_URL}/admin/servicos/${editingService.id}`
            : `${API_BASE_URL}/admin/empresas/${empresaId}/servicos`;
        const method = editingService ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(data) });
            if (res.ok) {
                toast.success(`Serviço ${editingService ? 'atualizado' : 'adicionado'} com sucesso!`);
                onUpdate();
                setNovoServico({ nome: '', descricao: '', duracao_minutos: '', preco: '' });
                setEditingService(null);
            } else throw new Error('Falha ao salvar serviço');
        } catch (error) {
            toast.error('Erro ao salvar serviço.');
            console.error(error);
        }
    };

    const handleDelete = async (servicoId) => {
        if (!window.confirm('Tem certeza?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/servicos/${servicoId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                toast.success('Serviço excluído com sucesso!');
                onUpdate();
            } else throw new Error('Falha ao excluir serviço');
        } catch (error) {
            toast.error('Erro ao excluir serviço.');
            console.error(error);
        }
    };

    return (
        <div className="admin-card">
            <h2>Gerenciar Serviços</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
                <h3>{editingService ? "Editar Serviço" : "Adicionar Novo Serviço"}</h3>
                <input type="text" name="nome" placeholder="Nome do Serviço" value={editingService ? editingService.nome : novoServico.nome} onChange={handleInputChange} required />
                <textarea name="descricao" placeholder="Descrição" value={editingService ? editingService.descricao : novoServico.descricao} onChange={handleInputChange} />
                <input type="number" name="duracao_minutos" placeholder="Duração (minutos)" value={editingService ? editingService.duracao_minutos : novoServico.duracao_minutos} onChange={handleInputChange} required />
                <input type="number" name="preco" placeholder="Preço (ex: 50.00)" value={editingService ? editingService.preco : novoServico.preco} onChange={handleInputChange} required />
                <div className="form-buttons">
                    <button type="submit" className="btn-primary">{editingService ? "Salvar" : "Adicionar"}</button>
                    {editingService && <button type="button" className="btn-secondary" onClick={() => setEditingService(null)}>Cancelar</button>}
                </div>
            </form>
            <div className="lista-dados">
                <h3>Serviços Cadastrados</h3>
                {servicos.length > 0 ? (
                    <ul>
                        {servicos.map(s => (
                            <li key={s.id}>
                                <div><strong>{s.nome}</strong> ({s.duracao_minutos} min - R$ {s.preco})</div>
                                <div className="item-actions">
                                    <button className="btn-action" onClick={() => setEditingService(s)}>Editar</button>
                                    <button className="btn-danger" onClick={() => handleDelete(s.id)}>Excluir</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : <p>Nenhum serviço cadastrado.</p>}
            </div>
        </div>
    );
};
const ListaAgendamentos = ({ agendamentos, onUpdate}) => {

     const handleDownloadExcel = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/admin/agendamentos/download`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Falha ao gerar o arquivo Excel.');
            }

            // Converte a resposta em um arquivo "blob"
            const blob = await response.blob();
            // Cria uma URL temporária para o arquivo
            const url = window.URL.createObjectURL(blob);
            // Cria um link invisível e clica nele para iniciar o download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'agendamentos.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            toast.error("Erro ao baixar o arquivo.");
            console.error('Erro no download do Excel:', error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
         const token = localStorage.getItem('token');
         try {
             const res = await fetch(`${API_BASE_URL}/admin/agendamentos/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ status }) });
             if (res.ok) {
                toast.success('Agendamento confirmado com sucesso!');
                onUpdate();
             } else throw new Error('Falha ao confirmar agendamento');
         } catch (error) {
             toast.error('Erro ao confirmar agendamento.');
             console.error(error);
         }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/agendamentos/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                 toast.success('Agendamento excluído com sucesso!');
                onUpdate();
            } else throw new Error('Falha ao excluir agendamento');
        } catch (error) {
            toast.error('Erro ao excluir agendamento.');
            console.error(error);
        }
    };

    return (
        <div className="admin-card">
            <div className="admin-card-header">
                <h2>Agendamentos Recebidos</h2>
                <button className="btn-secondary" onClick={handleDownloadExcel}>Baixar em Excel</button>
            </div>
            
            <div className="lista-agendamentos">
                {agendamentos.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Serviço</th>
                                <th>Data</th>
                                <th>Hora</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agendamentos.map(ag => (
                                <tr key={ag.id}>
                                    <td>{ag.nome_cliente}</td>
                                    <td>{ag.nome_servico}</td>
                                    <td>{new Date(ag.data).toLocaleDateString()}</td>
                                    <td>{ag.hora.substring(0, 5)}</td>
                                    <td><span className={`status-tag ${ag.status}`}>{ag.status}</span></td>
                                    <td>
                                        <div className="item-actions">
                                            {ag.status === 'pendente' && (
                                                <button className="btn-confirmar" onClick={() => handleStatusUpdate(ag.id, 'confirmado')}>Confirmar</button>
                                            )}
                                            <button className="btn-danger" onClick={() => handleDelete(ag.id)}>Excluir</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>Nenhum agendamento recebido.</p>}
            </div>
        </div>
    );
};

const EditorHorarios = ({ horarios, empresaId, onUpdate }) => {
    const [novoHorario, setNovoHorario] = useState({ dia_da_semana: '', hora_inicio: '', hora_termino: '' });
    
    const diasDaSemanaMap = {
        'segunda': 'Segunda-feira', 'terca': 'Terça-feira', 'quarta': 'Quarta-feira',
        'quinta': 'Quinta-feira', 'sexta': 'Sexta-feira', 'sabado': 'Sábado', 'domingo': 'Domingo'
    };

    const horariosAgrupados = horarios.reduce((acc, h) => {
        if (!acc[h.dia_da_semana]) {
            acc[h.dia_da_semana] = [];
        }
        acc[h.dia_da_semana].push(h);
        return acc;
    }, {});

    const handleInputChange = (e) => setNovoHorario({ ...novoHorario, [e.target.name]: e.target.value });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/horarios`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ ...novoHorario, empresa_id: empresaId }) });
            if (res.ok) {
                toast.success('Horário adicionado com sucesso!');
                onUpdate();
                setNovoHorario({ dia_da_semana: '', hora_inicio: '', hora_termino: '' });
            } else throw new Error('Falha ao adicionar horário');
        } catch (error) {
            toast.error('Erro ao salvar horário.');
            console.error(error);
        }
    };
    
    const handleDelete = async (horarioId) => {
        if (!window.confirm('Tem certeza?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/horarios/${horarioId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                toast.success('Horário excluído com sucesso!');
                onUpdate();
            } else throw new Error('Falha ao excluir horário');
        } catch (error) {
            toast.error('Erro ao excluir horário.');
            console.error(error);
        }
    };

    return (
        <div className="admin-card">
            <h2>Horários de Atendimento</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
                <h3>Adicionar Novo Horário</h3>
                <select name="dia_da_semana" value={novoHorario.dia_da_semana} onChange={handleInputChange} required>
                    <option value="">Selecione...</option>
                    {Object.keys(diasDaSemanaMap).map(dia => (<option key={dia} value={dia}>{diasDaSemanaMap[dia]}</option>))}
                </select>
                <input type="time" name="hora_inicio" value={novoHorario.hora_inicio} onChange={handleInputChange} required />
                <input type="time" name="hora_termino" value={novoHorario.hora_termino} onChange={handleInputChange} required />
                <div className="form-buttons"><button type="submit" className="btn-primary">Adicionar</button></div>
            </form>
            <div className="lista-dados">
                <h3>Horários Cadastrados</h3>
                {Object.keys(horariosAgrupados).length > 0 ? (
                    Object.keys(diasDaSemanaMap).map(dia => (
                        horariosAgrupados[dia] && (
                            <div key={dia} className="horario-dia-admin">
                                <strong>{diasDaSemanaMap[dia]}:</strong>
                                <ul className="horarios-intervalos-admin">
                                    {horariosAgrupados[dia].map(h => (
                                        <li key={h.id}>
                                            <span>{h.hora_inicio.substring(0, 5)} - {h.hora_termino.substring(0, 5)}</span>
                                            <button className="btn-danger btn-excluir-horario" onClick={() => handleDelete(h.id)}>Excluir</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    ))
                ) : <p>Nenhum horário cadastrado.</p>}
            </div>
        </div>
    );
};

const LinkAgendamento = ({ empresaSlug }) => {
    // Pega a URL base do site atual (ex: 'https://g2plannix.netlify.app')
    const agendamentoUrl = `${window.location.origin}/agendamento/${empresaSlug}`;
    return (
        <div className="admin-card link-agendamento-container">
            <h2>Compartilhe seu Link de Agendamento</h2>
            <p>Seus clientes podem agendar um horário usando este link:</p>
            <div className="link-box">
                <a href={agendamentoUrl} target="_blank" rel="noopener noreferrer">{agendamentoUrl}</a>
                <button className="btn-primary" onClick={() => navigator.clipboard.writeText(agendamentoUrl)}>Copiar</button>
            </div>
        </div>
    );
};

// ===================================================================
// == NOVO SUB-COMPONENTE PARA GERENCIAR A CONTA ==
// ===================================================================
const MinhaConta = ({ }) => {
    const [dadosEmpresa, setDadosEmpresa] = useState(null);
    const [senha, setSenha] = useState({ senha_atual: '', nova_senha: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDados = async () => {
            const token = localStorage.getItem('token');
            try {
                // ADICIONADO '/admin' NA URL
                const res = await fetch(`${API_BASE_URL}/admin/empresas/minha-conta`, { 
                    headers: { 'Authorization': `Bearer ${token}` } 
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setDadosEmpresa(data);
                } else {
                    localStorage.clear();
                    navigate('/login');
                }
            } catch (error) {
                console.error('Erro ao buscar dados da conta:', error);
            }
        };
        fetchDados();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDadosEmpresa(prev => ({ ...prev, [name]: value }));
    };

    const handleSenhaChange = (e) => {
        const { name, value } = e.target;
        setSenha(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const body = { ...dadosEmpresa };
            if (senha.nova_senha) {
                body.senha_atual = senha.senha_atual;
                body.nova_senha = senha.nova_senha;
            }

            // ADICIONADO '/admin' NA URL
            const res = await fetch(`${API_BASE_URL}/admin/empresas/minha-conta`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(body)
            });

            const result = await res.json();
            if (res.ok) {
                toast.success('Dados atualizados com sucesso');
                const empresaStorage = JSON.parse(localStorage.getItem('empresa'));
                if (empresaStorage.nome !== result.empresa.nome) {
                    empresaStorage.nome = result.empresa.nome;
                    localStorage.setItem('empresa', JSON.stringify(empresaStorage));
                }
                setSenha({ senha_atual: '', nova_senha: '' });
            } else {
                toast.error('erro');
            }
        } catch (error) {
            toast.error('Erro de conexão.');
            console.error('Erro ao atualizar conta:', error);
        }
    };
    
    if (!dadosEmpresa) return <div>Carregando dados da conta...</div>;

    return (
        <div className="admin-card">
            <h2>Minha Conta</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
                <h3>Dados Cadastrais</h3>
                <input type="text" name="nome_titular" value={dadosEmpresa.nome_titular || ''} onChange={handleInputChange} placeholder="Nome do Titular" required />
                <input type="text" name="nome" value={dadosEmpresa.nome} onChange={handleInputChange} placeholder="Nome Fantasia da Empresa" required />
                <input type="email" name="email" value={dadosEmpresa.email} onChange={handleInputChange} placeholder="E-mail" required />
                <input type="text" name="cpf_cnpj" value={dadosEmpresa.cpf_cnpj || ''} onChange={handleInputChange} placeholder="CPF/CNPJ" required />
                <input type="text" name="cep" value={dadosEmpresa.cep || ''} onChange={handleInputChange} placeholder="CEP" required />
                <input type="text" name="endereco" value={dadosEmpresa.endereco || ''} onChange={handleInputChange} placeholder="Endereço" />
                <input type="tel" name="telefone" value={dadosEmpresa.telefone || ''} onChange={handleInputChange} placeholder="Telefone" />
                
                <h3 style={{ marginTop: '20px' }}>Alterar Senha</h3>
                <p style={{ fontSize: '0.9rem', color: '#7f8c8d', marginTop: '-10px', marginBottom: '10px' }}>Deixe em branco para não alterar</p>
                <input type="password" name="senha_atual" value={senha.senha_atual} onChange={handleSenhaChange} placeholder="Senha Atual" />
                <input type="password" name="nova_senha" value={senha.nova_senha} onChange={handleSenhaChange} placeholder="Nova Senha" />

                <div className="form-buttons">
                    <button type="submit" className="btn-primary">Salvar Alterações</button>
                </div>
            </form>
        </div>
    );
};

const AbaSuporte = ({ }) => {
    const [mensagemSuporte, setMensagemSuporte] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const numeroWhatsapp = '5511980024862'; 
    const mensagemWhatsapp = encodeURIComponent("Olá! Preciso de ajuda com a plataforma G2Plannix.");
    const whatsappUrl = `https://wa.me/${numeroWhatsapp}?text=${mensagemWhatsapp}`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API_BASE_URL}/admin/suporte/enviar-mensagem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ mensagem: mensagemSuporte })
            });

            const result = await res.json();
            if (res.ok) {
                toast.success('sucesso');
                setMensagemSuporte(''); // Limpa o campo
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            toast.error('Erro ao enviar mensagem.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="admin-card">
            <h2>Central de Suporte</h2>
            <div className="suporte-container">
                {/* Seção de Contato por WhatsApp */}
                <div className="suporte-card whatsapp-card">
                    <h3>Atendimento Imediato</h3>
                    <p>Precisa de ajuda urgente? Clique no botão abaixo para falar conosco diretamente pelo WhatsApp.</p>
                   <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                    <FaWhatsapp size={20} style={{ marginRight: '10px' }} />Falar no WhatsApp</a>
                </div>

                {/* Seção de Envio de E-mail */}
                <div className="suporte-card email-card">
                    <h3>Abrir um Chamado</h3>
                    <p>Para dúvidas, sugestões ou problemas não urgentes, descreva sua necessidade abaixo e enviaremos para nossa equipe.</p>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <textarea
                            name="mensagemSuporte"
                            placeholder="Digite sua mensagem aqui..."
                            value={mensagemSuporte}
                            onChange={(e) => setMensagemSuporte(e.target.value)}
                            required
                            rows="6"
                        />
                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// ===================================================================
// == COMPONENTE PRINCIPAL DO PAINEL ADMIN ==
// ===================================================================
const PainelAdmin = () => {
    const [empresaLogada, setEmpresaLogada] = useState(null);
    const [agendamentos, setAgendamentos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [abaAtiva, setAbaAtiva] = useState('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        const empresa = JSON.parse(localStorage.getItem('empresa'));
        const token = localStorage.getItem('token');
        if (empresa && token) {
            setEmpresaLogada(empresa);
            fetchTodosOsDados(empresa.id, token);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchTodosOsDados = async (empresaId, token) => {
        try {
            const [agendamentosRes, servicosRes, horariosRes] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/agendamentos`, { headers: { 'Authorization': `Bearer ${token}` } }),
                
                fetch(`${API_BASE_URL}/admin/empresas/${empresaId}/servicos`, { headers: { 'Authorization': `Bearer ${token}` } }),
                
                fetch(`${API_BASE_URL}/admin/horarios-atendimento`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            // Verifica se todas as respostas foram bem-sucedidas
            if (!agendamentosRes.ok || !servicosRes.ok || !horariosRes.ok) {
                throw new Error('Falha ao carregar os dados do painel.');
            }

            const agendamentosData = await agendamentosRes.json();
            const servicosData = await servicosRes.json();
            const horariosData = await horariosRes.json();

            setAgendamentos(agendamentosData);
            setServicos(servicosData);
            setHorarios(horariosData);
        } catch (error) {
      console.error('Erro ao buscar dados do painel:', error);
            toast.error(error.message);
            localStorage.clear();
            navigate('/login');
        }
    };
    
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };
    
    if (!empresaLogada) return <div className="loading-container">Carregando...</div>;

    const onUpdate = () => fetchTodosOsDados(empresaLogada.id, localStorage.getItem('token'));

    return (
        <div className="painel-admin-container">
            <header className="painel-header">
                <h1>Painel de <span className="empresa-nome">{empresaLogada.nome}</span></h1>
            </header>

            <div className="painel-tabs">
                <button className={`tab-btn ${abaAtiva === 'dashboard' ? 'active' : ''}`} onClick={() => setAbaAtiva('dashboard')}>Dashboard</button>
                <button className={`tab-btn ${abaAtiva === 'agendamentos' ? 'active' : ''}`} onClick={() => setAbaAtiva('agendamentos')}>Agendamentos</button>
                <button className={`tab-btn ${abaAtiva === 'servicos' ? 'active' : ''}`} onClick={() => setAbaAtiva('servicos')}>Serviços</button>
                <button className={`tab-btn ${abaAtiva === 'horarios' ? 'active' : ''}`} onClick={() => setAbaAtiva('horarios')}>Horários</button>
                <button className={`tab-btn ${abaAtiva === 'link' ? 'active' : ''}`} onClick={() => setAbaAtiva('link')}>Link</button>
                <button className={`tab-btn ${abaAtiva === 'conta' ? 'active' : ''}`} onClick={() => setAbaAtiva('conta')}>Minha Conta</button>
                <button className={`tab-btn ${abaAtiva === 'suporte' ? 'active' : ''}`} onClick={() => setAbaAtiva('suporte')}>Suporte</button>
                <button className={`tab-btn ${abaAtiva === 'assinatura' ? 'active' : ''}`} onClick={() => setAbaAtiva('assinatura')}>Assinatura</button>
            </div>

           <div className="painel-conteudo">
                <div className={`painel-section ${abaAtiva === 'dashboard' ? '' : 'hide'}`}><Dashboard /></div>
                <div className={`painel-section ${abaAtiva === 'agendamentos' ? '' : 'hide'}`}><ListaAgendamentos agendamentos={agendamentos} onUpdate={onUpdate} /></div>
                <div className={`painel-section ${abaAtiva === 'servicos' ? '' : 'hide'}`}><GerenciadorServicos servicos={servicos} empresaId={empresaLogada.id} onUpdate={onUpdate} /></div>
                <div className={`painel-section ${abaAtiva === 'horarios' ? '' : 'hide'}`}><EditorHorarios horarios={horarios} empresaId={empresaLogada.id} onUpdate={onUpdate} /></div>
                <div className={`painel-section ${abaAtiva === 'link' ? '' : 'hide'} painel-section-center`}><LinkAgendamento empresaSlug={empresaLogada.slug} /></div>
                <div className={`painel-section ${abaAtiva === 'conta' ? '' : 'hide'}`}><MinhaConta /></div>
                <div className={`painel-section ${abaAtiva === 'suporte' ? '' : 'hide'}`}><AbaSuporte /></div>
                <div className={`painel-section ${abaAtiva === 'assinatura' ? '' : 'hide'}`}><AbaAssinatura /></div>
            </div>
        </div>
    );
};

export default PainelAdmin;