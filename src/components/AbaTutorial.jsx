import React from 'react';
// Importando os ícones que vamos usar
import { IoShareOutline } from "react-icons/io5";
import { MdAddToHomeScreen, MdMoreVert } from "react-icons/md";

const AbaTutorial = () => {
  return (
    <div className="admin-card">
      <h2>Instale o App no seu Celular</h2>
      <p>Siga os passos abaixo para adicionar um atalho do sistema à tela inicial do seu celular, funcionando como um aplicativo e recebendo notificações de novos agendamentos!</p>

      <div className="tutorial-container">
        {/* Tutorial para iPhone */}
        <div className="tutorial-card">
          <h3>Para iPhone (Safari)</h3>
          <ol className="tutorial-steps">
            <li>
              <span>Toque no ícone de <strong>Compartilhar</strong> na barra do navegador.</span>
              <IoShareOutline size={28} className="tutorial-icon" />
            </li>
            <li>
              <span>Role para baixo e selecione a opção <strong>"Adicionar à Tela de Início"</strong>.</span>
              <MdAddToHomeScreen size={28} className="tutorial-icon" />
            </li>
            <li>
              <span>Abra o aplicativo pelo novo ícone na sua tela de início e, quando solicitado, permita o recebimento de notificações.</span>
            </li>
          </ol>
        </div>

        {/* Tutorial para Android */}
        <div className="tutorial-card">
          <h3>Para Android (Chrome)</h3>
          <ol className="tutorial-steps">
            <li>
              <span>Toque no ícone de <strong>três pontinhos</strong> no canto superior do navegador.</span>
              <MdMoreVert size={28} className="tutorial-icon" />
            </li>
            <li>
              <span>Selecione a opção <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</span>
              <MdAddToHomeScreen size={28} className="tutorial-icon" />
            </li>
            <li>
              <span>Abra o aplicativo pelo novo ícone e permita o recebimento de notificações quando solicitado.</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AbaTutorial;