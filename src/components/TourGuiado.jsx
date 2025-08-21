import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';

// 1. Receba a prop { setAbaAtiva }
const TourGuiado = ({ setAbaAtiva }) => { 
    const [runTour, setRunTour] = useState(false);

    // 2. Adicione a propriedade 'before' aos passos para trocar de aba
    const steps = [
        {
            target: '#dashboard-card',
            content: 'Bem-vindo ao seu painel! Aqui você tem uma visão geral rápida do seu negócio.',
            placement: 'bottom',
            // O primeiro passo não precisa do 'before' pois o dashboard já é a aba padrão
        },
         {
            target: '#agendamentos-card',
            content: 'Nesta seção, você pode ver e gerenciar todos os agendamentos recebidos, podendo confirmar a cada agendamento e baixando como planilha!',
            placement: 'right',
            // A MUDANÇA ESTÁ AQUI: Adicionamos a Promise com setTimeout
            before: () => new Promise(resolve => {
                setAbaAtiva('agendamentos');
                setTimeout(resolve, 300); // Dá 300ms para o React redesenhar a tela
            }),
        },
        {
            target: '#servicos-card',
            content: 'Aqui você pode adicionar, editar ou remover os serviços que sua empresa oferece.',
            placement: 'right',
            before: () => new Promise(resolve => {
                setAbaAtiva('servicos');
                setTimeout(resolve, 300);
            }),
        },
        {
            target: '#horarios-card',
            content: 'Aqui você decide quando irá trabalhar! adicione horarios por expediente, por exmplo: Segunda das 09:00 as 12:00 e <br> segunda das 13:00 as 18:00 assim ninguem irá conseguir agendar entre 12 e 13 da tarde!',
            placement: 'right',
            before: () => new Promise(resolve => {
                setAbaAtiva('horarios');
                setTimeout(resolve, 300);
            }),
        },
        {
            target: '#link-card',
            content: 'Este é o seu link mágico! Copie e compartilhe com seus clientes para que eles possam agendar um horário.',
            placement: 'bottom',
            before: () => new Promise(resolve => {
                setAbaAtiva('link');
                setTimeout(resolve, 300);
            }),
        },
          {
            target: '#conta-card',
            content: 'Aqui você visualiza seu cadastro e edita qualquer informação que possa estar errada!',
            placement: 'right',
            before: () => new Promise(resolve => {
                setAbaAtiva('conta');
                setTimeout(resolve, 300);
            }),
        },
          {
            target: '#assinatura-card',
            content: 'Seção de assinatura onde poderar alterar, cancelar e o mais importante RENOVAR sua assinatura!',
            placement: 'right',
            before: () => new Promise(resolve => {
                setAbaAtiva('assinatura');
                setTimeout(resolve, 300);
            }),
        },
          {
            target: '.painel-tabs',
            content: 'Use estas abas para navegar entre as diferentes seções do seu painel. Explore à vontade!',
            placement: 'bottom',
            // Este não precisa do 'before' pois as abas estão sempre visíveis
        },
    ];

    // Lógica para rodar o tour (permanece a mesma)
    useEffect(() => {
        const tourJaVisto = localStorage.getItem('tourCompleto');
        if (!tourJaVisto) {
            setRunTour(true);
        }
    }, []);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRunTour(false);
            localStorage.setItem('tourCompleto', 'true');
            // Opcional: volta para a aba principal ao final do tour
            setAbaAtiva('dashboard'); 
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            steps={steps}
            run={runTour}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            locale={{
                back: 'Voltar',
                close: 'Fechar',
                last: 'Fim',
                next: 'Próximo',
                skip: 'Pular',
            }}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: '#1274e4',
                },
            }}
        />
    );
};

export default TourGuiado;