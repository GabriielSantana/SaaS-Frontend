// src/components/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import G2PlannixGif from '../assets/G2Plannix.gif'; // Verifique se o caminho para o seu GIF está correto

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [menuOpen, setMenuOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const prevScrollY = useRef(0);

    // Efeito para verificar o login quando a rota muda
    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, [location]);

    // Efeito de scroll para esconder/mostrar o header
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > prevScrollY.current && currentScrollY > 100) {
                setVisible(false);
                setMenuOpen(false); // Fecha o menu ao rolar para baixo
            } else if (currentScrollY < prevScrollY.current) {
                setVisible(true);
            }
            prevScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('empresa');
        setIsLoggedIn(false);
        setMenuOpen(false);
        navigate('/login');
    };

    const handleLinkClick = () => {
        setMenuOpen(false); // Garante que o menu feche ao clicar em um link
    };

    return (
        <header className={`main-header ${visible ? 'visible' : 'hidden'}`}>
            <div className="header-container">
                <Link to="/" className="logo" onClick={handleLinkClick}>
                    <img src={G2PlannixGif} alt="G2 Plannix" className="logo-image" />
                </Link>

                <div className={`menu-icon ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
                    <div className="bar1"></div>
                    <div className="bar2"></div>
                    <div className="bar3"></div>
                </div>

                <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
                    {isLoggedIn ? (
                        <>
                            <Link to="/painel" onClick={handleLinkClick}>Painel</Link>
                            <button onClick={handleLogout} className="btn-logout-header">Sair</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={handleLinkClick}>Login</Link>
                            <Link to="/registro" onClick={handleLinkClick} className="nav-highlight">Cadastrar</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;