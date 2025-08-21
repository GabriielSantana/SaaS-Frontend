// src/components/EmpresaRegistro.jsx - VERSÃO FINAL CORRIGIDA

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import { toast } from 'react-toastify';
import './EmpresaRegistro.css';

// Define a URL base da sua API
import { API_BASE_URL } from '../api';

const EmpresaRegistro = () => {
    const [tipoDocumento, setTipoDocumento] = useState('cnpj');
    const [empresa, setEmpresa] = useState({
        nome: '', email: '', senha: '', telefone: '',
        endereco: '', cpf_cnpj: '', cep: '', nome_titular: ''
    });
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (value, name) => {
        setEmpresa(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        // Remove todos os caracteres que não são números do CEP
        const cepLimpo = empresa.cep.replace(/\D/g, '');

        // Verifica se o CEP tem 8 dígitos para fazer a busca
        if (cepLimpo.length === 8) {
            const fetchEndereco = async () => {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                    const data = await response.json();
                    if (!data.erro) {
                        // Preenche o campo de endereço com os dados retornados
                        const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                        setEmpresa(prev => ({ ...prev, endereco: enderecoCompleto }));
                    }
                } catch (error) {
                    console.error("Erro ao buscar CEP:", error);
                }
            };
            fetchEndereco();
        }
    }, [empresa.cep]);

    const mascaraDocumento = tipoDocumento === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (empresa.senha !== confirmarSenha) {
        toast.error('As senhas não coincidem.');
        return;
    }
    try {
            const response = await fetch(`${API_BASE_URL}/auth/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(empresa),
            });
            
            const result = await response.json();

            if (response.ok) {
                toast.success("Registo quase completo! Por favor, verifique o seu e-mail.");
                // Redireciona para a página de login após 3 segundos
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                toast.error(result.message || 'Ocorreu um erro no registro.');
            }
        } catch (error) {
            toast.error('Erro de conexão. Verifique o servidor.');
        }
    };

    return (
        <div className="empresa-registro-container">
            <div className="empresa-registro-card">
                <h1>Cadastre-se</h1>
                <p>Crie sua conta para começar a gerenciar seus agendamentos.</p>

                <form onSubmit={handleSubmit} className="empresa-registro-form">
                    <div className="form-input-group">
                        <input type="text" name="nome_titular" placeholder="Nome Completo do Titular" value={empresa.nome_titular} onChange={(e) => handleInputChange(e.target.value, 'nome_titular')} required />
                    </div>

                    <div className="form-input-group">
                        <input type="text" name="nome" placeholder="Nome Fantasia da Empresa" value={empresa.nome} onChange={(e) => handleInputChange(e.target.value, 'nome')} required />
                    </div>

                    <div className="form-input-group">
                        <input type="email" name="email" placeholder="E-mail" value={empresa.email} onChange={(e) => handleInputChange(e.target.value, 'email')} required />
                    </div>

                    <div className="form-input-group tipo-documento-selector">
                        <label>
                            <input type="radio" name="tipo_documento" value="cnpj" checked={tipoDocumento === 'cnpj'} onChange={() => setTipoDocumento('cnpj')} /> CNPJ
                        </label>
                        <label>
                            <input type="radio" name="tipo_documento" value="cpf" checked={tipoDocumento === 'cpf'} onChange={() => setTipoDocumento('cpf')} /> CPF
                        </label>
                    </div>

                    <div className="form-input-group">
                        <IMaskInput mask={mascaraDocumento} name="cpf_cnpj" placeholder={tipoDocumento === 'cpf' ? 'CPF' : 'CNPJ'} value={empresa.cpf_cnpj} onAccept={(value) => handleInputChange(value, 'cpf_cnpj')} required />
                    </div>

                    <div className="form-input-group">
                        <IMaskInput mask="00000-000" name="cep" placeholder="CEP" value={empresa.cep} onAccept={(value) => handleInputChange(value, 'cep')} required />
                    </div>

                    <div className="form-input-group">
                        <input type="text" name="endereco" placeholder="Endereço" value={empresa.endereco} onChange={(e) => handleInputChange(e.target.value, 'endereco')} />
                    </div>

                    <div className="form-input-group">
                        <IMaskInput mask="(00) 00000-0000" name="telefone" placeholder="Telefone" value={empresa.telefone} onAccept={(value) => handleInputChange(value, 'telefone')} />
                    </div>

                    <div className="form-input-group">
                        <input type="password" name="senha" placeholder="Senha" value={empresa.senha} onChange={(e) => handleInputChange(e.target.value, 'senha')} required />
                    </div>

                    <div className="form-input-group">
                        <input type="password" name="confirmarSenha" placeholder="Confirmar Senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
                    </div>

                    <div className="form-input-group">
                        <button type="submit">Finalizar Cadastro</button>
                    </div>
                </form>

                <p className="link-login">
                    Já tem uma conta? <Link to="/login">Faça login aqui</Link>
                </p>
            </div>
        </div>
    );
};

export default EmpresaRegistro;