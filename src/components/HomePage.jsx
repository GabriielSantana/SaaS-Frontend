// src/components/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import './HomePage.css'; // Criaremos este arquivo a seguir

// Ícones simples para as funcionalidades 
const AgendamentoIcon = () => <span>📅</span>;
const PainelIcon = () => <span>📊</span>;
const ServicosIcon = () => <span>💅</span>;
const LinkIcon = () => <span>🔗</span>;

const HomePage = () => {
    return (
        <main className="homepage-container">
            {/* Seção Principal (Hero) */}
            <section className="hero-section">
                <h1>Transforme a Gestão do seu Negócio</h1>
                <p className="subtitle">Agendamentos online, controle de clientes e muito mais. Comece com 30 dias gratuitos.</p>
               <Link to="/registro" className="cta-button">Experimente o Primeiro Mês Grátis</Link>
               <p className="pricing-note">Após o período de teste, apenas R$ 35,90/mês.</p>
            </section>

            {/* Seção de Funcionalidades */}
            <section className="features-section">
                <h2>Funcionalidades Principais</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon"><AgendamentoIcon /></div>
                        <h3>Agendamento Online</h3>
                        <p>Seus clientes agendam horários 24/7 através de um link exclusivo para sua empresa.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><PainelIcon /></div>
                        <h3>Painel de Controle</h3>
                        <p>Visualize e gerencie todos os seus agendamentos em uma interface simples e intuitiva.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><ServicosIcon /></div>
                        <h3>Gestão de Serviços</h3>
                        <p>Cadastre e edite seus serviços, definindo preços e durações personalizadas.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><LinkIcon /></div>
                        <h3>Link Exclusivo</h3>
                        <p>Compartilhe seu link de agendamento nas redes sociais e facilite a vida dos seus clientes.</p>
                    </div>
                </div>
            </section>

            {/* Seção do Criador (Instagram) */}
            <section className="creator-section">
                <h2>Uma Ferramenta Criada por Gabriel Gomes</h2>
                <p>Feita para simplificar a vida de empreendedores como você.</p>
                <a href="https://www.instagram.com/g2plannix" target="_blank" rel="noopener noreferrer" className="instagram-button"> 
                <FaInstagram size={20} style={{ marginRight: '15px' }} />Siga no Instagram</a>
            </section>

            {/* Seção de Suporte */}
            <section className="support-section">
                <h2>Suporte</h2>
                <p>Encontrou algum problema ou tem alguma dúvida? Entre em contato conosco pelo e-mail:</p>
                <a href="mailto:g2plannix@gmail.com" className="support-email">g2plannix@gmail.com</a>
            </section>
        </main>
    );
};

export default HomePage;