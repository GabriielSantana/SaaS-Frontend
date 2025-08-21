import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const TourGuiado = () => {
    const [runTour, setRunTour] = useState(false);

    // Define os passos do nosso tutorial
    const steps = [
        {
            target: '#dashboard-card', // O seletor CSS do elemento que definimos no Passo 2
            content: 'Bem-vindo ao seu painel! Aqui você tem uma visão geral rápida do seu negócio.',
            placement: 'center', // Posição do pop-up
        },
        {
            target: '#agendamentos-card',
            content: 'Nesta seção, você pode ver e gerenciar todos os agendamentos recebidos, podendo confirmar a cada agendamento e baixando como planilha!',
        },
        {
            target: '#servicos-card',
            content: 'Aqui você pode adicionar, editar ou remover os serviços que sua empresa oferece.',
        },
        {
            target: '#horarios-card',
            content: 'Aqui você decide quando irá trabalhar! adicione horarios por expediente, por exmplo: Segunda das 09:00 as 12:00 e <br> segunda das 13:00 as 18:00 assim ninguem irá conseguir agendar entre 12 e 13 da tarde!',
        },
        {
            target: '#link-card', // Podemos usar uma classe também
            content: 'Este é o seu link mágico! Copie e compartilhe com seus clientes para que eles possam agendar um horário.',
        },
          {
            target: '#conta-card', // Podemos usar uma classe também
            content: 'Aqui você visualiza seu cadastro e edita qualquer informação que possa estar errada!',
        },
          {
            target: '#assinatura-card', // Podemos usar uma classe também
            content: 'Seção de assinatura onde poderar alterar, cancelar e o mais importante RENOVAR sua assinatura!',
        },
          {
            target: '.painel-tabs', // Podemos usar uma classe também
            content: 'Use estas abas para navegar entre as diferentes seções do seu painel. Explore à vontade!',
        },
    ];

    // Lógica para rodar o tour apenas na primeira visita
    useEffect(() => {
        const tourJaVisto = localStorage.getItem('tourCompleto');
        if (!tourJaVisto) {
            setRunTour(true);
        }
    }, []);

    // Função chamada sempre que o estado do tour muda
    const handleJoyrideCallback = (data) => {
        const { status } = data;
        
        // Se o tour terminou (concluído ou pulado), marca como visto
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRunTour(false);
            localStorage.setItem('tourCompleto', 'true');
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            steps={steps}
            run={runTour}
            continuous={true} // Para ir de um passo a outro com o botão "Próximo"
            showProgress={true} // Mostra o progresso (ex: 2/5)
            showSkipButton={true} // Mostra o botão para pular o tour
            locale={{
                back: 'Voltar',
                close: 'Fechar',
                last: 'Fim',
                next: 'Próximo',
                skip: 'Pular',
            }}
            styles={{
                options: {
                    zIndex: 10000, // Garante que o tour fique acima de tudo
                    primaryColor: '#1274e4', // Cor dos botões e destaques
                },
            }}
        />
    );
};

export default TourGuiado;