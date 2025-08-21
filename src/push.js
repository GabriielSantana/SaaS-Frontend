// src/push.js
import { API_BASE_URL } from './api';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

// Função para converter a chave pública para o formato correto
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function subscribeUserToPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.error("Push Notificações não são suportadas neste navegador.");
        return;
    }

    try {
        await navigator.serviceWorker.register('/sw.js');
        
        // --- ADIÇÃO CRÍTICA ABAIXO ---
        // Espera até que um Service Worker esteja ativo e a controlar a página.
        const swRegistration = await navigator.serviceWorker.ready;
        // -----------------------------

        let subscription = await swRegistration.pushManager.getSubscription();

        if (subscription === null) {
            subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
        }
        
        const token = localStorage.getItem('token');
        await fetch(`${API_BASE_URL}/admin/save-subscription`, {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        console.log("Utilizador subscrito com sucesso para notificações push.");
        alert("Notificações ativadas com sucesso!");

    } catch (error) {
        console.error("Erro ao subscrever para notificações push:", error);
        alert("Falha ao ativar as notificações. Por favor, tente novamente.");
    }
}