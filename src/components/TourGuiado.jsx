import React, { useState, useEffect } from 'react';
import Joyride, { STATUS, EVENTS, ACTIONS } from 'react-joyride';

const TourGuiado = ({ setAbaAtiva }) => {
    const [runTour, setRunTour] = useState(false);
    // 1. Vamos controlar o passo atual em nosso próprio estado
    const [stepIndex, setStepIndex] = useState(0);

    // 2. Simplificamos os passos, adicionando uma propriedade 'tab' para sabermos qual aba ativar
    const steps = [
        {
            target: '#dashboard-card',
            content: 'Bem-vindo ao seu painel! Aqui você tem uma visão geral rápida do seu negócio.',
            placement: 'bottom',
            tab: 'dashboard', // Aba correspondente
        },
        {
            target: '#agendamentos-card',
            content: 'Nesta seção, você pode ver e gerenciar todos os agendamentos recebidos, podendo confirmar a cada agendamento e baixando como planilha!',
            placement: 'right',
            tab: 'agendamentos',
        },
        {
            target: '#servicos-card',
            content: 'Aqui você pode adicionar, editar ou remover os serviços que sua empresa oferece.',
            placement: 'right',
            tab: 'servicos',
        },
        {
            target: '#horarios-card',
            content: 'Aqui você decide quando irá trabalhar! adicione horarios por expediente...',
            placement: 'right',
            tab: 'horarios',
        },
        {
            target: '#link-card',
            content: 'Este é o seu link mágico! Copie e compartilhe com seus clientes para que eles possam agendar um horário.',
            placement: 'bottom',
            tab: 'link',
        },
        {
            target: '#conta-card',
            content: 'Aqui você visualiza seu cadastro e edita qualquer informação que possa estar errada!',
            placement: 'right',
            tab: 'conta',
        },
        {
            target: '#assinatura-card',
            content: 'Seção de assinatura onde poderá alterar, cancelar e o mais importante RENOVAR sua assinatura!',
            placement: 'right',
            tab: 'assinatura',
        },
        {
            target: '.painel-tabs',
            content: 'Use estas abas para navegar entre as diferentes seções do seu painel. Explore à vontade!',
            placement: 'bottom',
            // Esta aba está sempre visível, então não precisa de uma propriedade 'tab' específica
        },
    ];

    // Lógica para iniciar o tour (permanece a mesma)
    useEffect(() => {
        const tourJaVisto = localStorage.getItem('tourCompleto');
        if (!tourJaVisto) {
            setRunTour(true);
        }
    }, []);

    // 3. Esta é a nova lógica de controle
    const handleJoyrideCallback = (data) => {
        const { action, index, status, type } = data;

        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            // Se o tour acabou, reseta tudo
            setRunTour(false);
            setStepIndex(0);
            localStorage.setItem('tourCompleto', 'true');
            setAbaAtiva('dashboard');
        } else if (type === EVENTS.STEP_AFTER && action === ACTIONS.NEXT) {
            // Quando o usuário clica em "NEXT"...
            const nextStepIndex = index + 1;
            const nextStep = steps[nextStepIndex];

            if (nextStep && nextStep.tab) {
                // ...troca a aba para a do próximo passo...
                setAbaAtiva(nextStep.tab);
            }
            // ...e atualiza o nosso índice para avançar o tour.
            setStepIndex(nextStepIndex);
        } else if (type === EVENTS.STEP_AFTER && action === ACTIONS.PREV) {
             // Quando o usuário clica em "VOLTAR"...
             const prevStepIndex = index - 1;
             const prevStep = steps[prevStepIndex];
 
             if (prevStep && prevStep.tab) {
                 setAbaAtiva(prevStep.tab);
             }
             setStepIndex(prevStepIndex);
        }
    };

    return (
        <Joyride
            // 4. Passamos nosso índice e a função de callback
            stepIndex={stepIndex}
            callback={handleJoyrideCallback}
            steps={steps}
            run={runTour}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            locale={{ back: 'Voltar', close: 'Fechar', last: 'Fim', next: 'Próximo', skip: 'Pular' }}
            styles={{ options: { zIndex: 10000, primaryColor: '#1274e4' } }}
        />
    );
};

export default TourGuiado;