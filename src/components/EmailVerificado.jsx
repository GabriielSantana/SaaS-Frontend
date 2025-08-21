import React from 'react';
import { Link } from 'react-router-dom';

const EmailVerificado = () => {
    // Objeto de estilo para o botão
    const buttonStyle = {
      display: 'inline-block',
      padding: '12px 25px',
      backgroundColor: '#2ecc71', // Um verde vibrante, comum em botões de sucesso
      color: 'white',
      textDecoration: 'none', // Remove o sublinhado do link
      borderRadius: '5px',    // Deixa os cantos arredondados
      fontWeight: 'bold',
      fontSize: '16px',
      marginTop: '20px',      // Adiciona um espaço acima do botão
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease' // Efeito suave ao passar o rato
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
            <h2>E-mail Verificado com Sucesso!</h2>
            <p>A sua conta foi ativada. Já pode fazer login para continuar.</p>
            <Link to="/login" style={buttonStyle}> {/* Estilo aplicado aqui */}
                Ir para o Login
            </Link>
        </div>
    );
};

export default EmailVerificado;