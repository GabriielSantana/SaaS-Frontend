import React, { useState, useEffect } from 'react';
import Joyride, { STATUS, EVENTS, ACTIONS } from 'react-joyride';

const TourGuiado = ({ setAbaAtiva }) => {
    const [runTour, setRunTour] = useState(false);
    // 1. Vamos controlar o passo atual em nosso próprio estado
    const [stepIndex, setStepIndex] = useState(0);

    // 2. Simplificamos os passos, adicionando uma propriedade 'tab' para sabermos qual aba ativar
    const steps = [
        {
            target: '#tab-dashboard',
            content: 'Bem-vindo ao seu painel! Aqui você tem uma visão geral dos agendamentos e faturamentos do dia.',
            placement: 'bottom',
            tab: 'dashboard', 
        },
        {
            target: '#date-dashboard',
            content: 'Aqui você seleciona a data para ver as metricas relacionadas!',
            placement: 'bottom',
            tab: 'dashboard', 
        },
        {
            target: '#tab-agendamentos',
            content: 'Nesta seção, você pode ver e gerenciar todos os agendamentos recebidos, podendo confirmar, deletar e podendo baixar como planilha para seus controles mensais!',
            placement: 'bottom',
            tab: 'agendamentos',
        },
          {
            target: '#tab-excel',
            content: 'Neste botão você baixa todos os seus agendamentos em excel caso desejar!',
            placement: 'bottom',
            tab: 'agendamentos',
        },
        {
            target: '#tab-servicos',
            content: 'Aqui você pode adicionar, editar ou remover os serviços que sua empresa oferece, gerenciando preços e tempo de cada um!',
            placement: 'bottom',
            tab: 'servicos',
        },
        {
            target: '#tab-horarios',
            content: 'Aqui você decide quando irá trabalhar! adicione horarios por expediente, como por exemplo: Segunda das 09:00 as 12:00 e depois adicionar novamente Segunda porém das 13:00 as 18:00, isso faz com que tenha 01(uma) hora livre que seria das 12:00 as 13:00',
            placement: 'bottom',
            tab: 'horarios',
        },
        {
            target: '#tab-link',
            content: 'Este é o seu link mágico! Copie e compartilhe com seus clientes para que eles possam agendar um horário.',
            placement: 'bottom',
            tab: 'link',
        },
        {
            target: '#tab-conta',
            content: 'Aqui você visualiza seu cadastro e edita qualquer informação que possa estar errada!',
            placement: 'bottom',
            tab: 'conta',
        },
         {
            target: '#btn-notificacao',
            content: 'Aqui você ativa as notificaçòes em tempo real dos seus agendamentos.',
            placement: 'bottom',
            tab: 'conta',
        },
        {
            target: '#tab-suporte',
            content: 'Aqui você abre chamados por E-mail ou diretamente com o Desenvolvedor, tenha sempre que puder o print ou codigo do Erro!',
            placement: 'bottom',
            tab: 'suporte',
        },
        {
            target: '#tab-tutorial',
            content: 'Aprenda aqui a instalar o sistema como um aplicativo no seu celular para ter acesso rápido e ativar as notificações!',
            placement: 'bottom',
            tab: 'tutorial',
        },
        {
            target: '#tab-financeiro',
            content: 'Seção de finanças, onde poderá acompanhar sua assinatura e configurar formas de pagamento para seus clientes',
            placement: 'bottom',
            tab: 'financeiro',
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
            styles={{ options: { zIndex: 10000, primaryColor: '#24e412ff' } }}
        />
    );
};

export default TourGuiado;