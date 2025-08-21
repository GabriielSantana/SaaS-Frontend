import React from 'react';
import { Link } from 'react-router-dom';

const VerificacaoFalhou = () => (
    <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Ocorreu um Erro na Verificação</h2>
        <p>O seu link de verificação pode ter expirado ou ser inválido. Por favor, tente novamente.</p>
        <Link to="/registro">Voltar ao Registo</Link>
    </div>
);

export default VerificacaoFalhou;