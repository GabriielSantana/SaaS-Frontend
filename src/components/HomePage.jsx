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
                <div className="hero-content">
                    <h1>Transforme a Gestão do seu Negócio</h1>
                    <p className="subtitle">Agendamentos online, controle de clientes e muito mais. Comece com 30 dias gratuitos.</p>
                    <Link to="/registro" className="cta-button">Experimente o Primeiro Mês Grátis</Link>
                    <p className="pricing-note">Após o período de teste, apenas R$ 35,90/mês.</p>
                </div>
                <div className="hero-image">
                    <img src="/mockup.png" alt="Painel de Controle G2Plannix" />
                </div>
            </section>

            {/* Seção de Funcionalidades */}
            <section className="features-section">
                <h2>Funcionalidades Principais</h2>
                <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon"><FaCalendarAlt /></div>
                    <h3>Agendamento Online</h3>
                    <p>Seus clientes agendam horários 24/7 através de um link exclusivo para sua empresa.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><FaChartBar /></div>
                    <h3>Painel de Controle</h3>
                    <p>Visualize e gerencie todos os seus agendamentos em uma interface simples e intuitiva.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><FaCogs /></div>
                    <h3>Gestão de Serviços</h3>
                    <p>Cadastre e edite seus serviços, definindo preços e durações personalizadas.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><FaLink /></div>
                    <h3>Link Exclusivo</h3>
                    <p>Compartilhe seu link de agendamento nas redes sociais e facilite a vida dos seus clientes.</p>
                </div>
            </div>
            </section>
                <footer className="footer-section">
                <div className="footer-container">
                    <div className="footer-about">
                        <h3>G2Plannix</h3>
                        <p>Uma ferramenta criada por Gabriel Gomes para simplificar a vida de empreendedores como você.</p>
                    </div>
                    <div className="footer-links">
                        <h3>Suporte</h3>
                        <a href="mailto:g2plannix@gmail.com">g2plannix@gmail.com</a>
                    </div>
                    <div className="footer-social">
                        <h3>Social</h3>
                        <a href="https://www.instagram.com/g2plannix" target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={24} />
                        </a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} G2Plannix. Todos os direitos reservados.</p>
                </div>
            </footer>
        </main>
    );
};

export default HomePage;