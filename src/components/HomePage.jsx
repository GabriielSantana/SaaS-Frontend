// src/components/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FaInstagram, FaCalendarAlt, FaChartBar, FaCogs, FaLink } from 'react-icons/fa';
import './HomePage.css'; // Criaremos este arquivo a seguir

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
    // Configurações do carrossel
    const carouselSettings = {
        dots: true, // Mostra os pontinhos de navegação
        infinite: true, // Loop infinito
        speed: 500, // Velocidade da transição em ms
        slidesToShow: 1, // Mostra um slide por vez
        slidesToScroll: 1, // Passa um slide por vez
        autoplay: true, // Passa os slides automaticamente
        autoplaySpeed: 4000, // Muda a cada 4 segundos
        pauseOnHover: true,
        adaptiveHeight: true, // Ajusta a altura dinamicamente
    };

    // Array com os dados das funcionalidades para o carrossel
    const features = [
        {
            icon: <FaCalendarAlt />,
            title: "Agendamento Online",
            description: "Seus clientes agendam horários 24/7 através de um link exclusivo para sua empresa.",
            image: "/mockup.png" 
        },
        {
            icon: <FaChartBar />,
            title: "Painel de Controle",
            description: "Visualize e gerencie todos os seus agendamentos em uma interface simples e intuitiva.",
            image: "/PAINEL DE CONTROLE.png" 
        },
        {
            icon: <FaCogs />,
            title: "Gestão de Serviços",
            description: "Cadastre e edite seus serviços, definindo preços e durações personalizadas.",
            image: "/SERVICOS.png" 
        },
        {
            icon: <FaLink />,
            title: "Link Exclusivo",
            description: "Compartilhe seu link de agendamento nas redes sociais e facilite a vida dos seus clientes.",
            image: "/LINK.png" 
        }
    ];

    return (
        <main className="homepage-container">
           <section className="hero-section">
                <div className="hero-content">
                    <h1>Transforme a Gestão do seu Negócio</h1>
                    <p className="subtitle">Agendamentos online, controle de clientes e muito mais. Comece com 30 dias gratuitos.</p>
                    <Link to="/registro" className="cta-button">Experimente o Primeiro Mês Grátis</Link>
                    <p className="pricing-note">Após o período de teste, apenas R$ 35,90/mês.</p>
                </div>
            </section>

            <section className="carousel-section">
                <h2>Conheça Nossas Ferramentas</h2>
                <div className="carousel-container">
                    <Slider {...carouselSettings}>
                        {features.map((feature, index) => (
                            <div key={index} className="carousel-slide">
                                <div className="carousel-image-container">
                                    <img src={feature.image} alt={feature.title} />
                                </div>
                                <div className="carousel-content">
                                    <div className="feature-icon">{feature.icon}</div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </Slider>
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