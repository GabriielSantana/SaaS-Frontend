import { API_BASE_URL } from './api';
import { toast } from 'react-toastify'; // Usaremos toast para mensagens melhores

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

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

async function sendSubscriptionToServer(subscription) {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE_URL}/admin/save-subscription`, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
}

export async function subscribeUserToPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        toast.error("Notificações Push não são suportadas neste navegador.");
        return;
    }

    try {
        await navigator.serviceWorker.register('/sw.js');
        const swRegistration = await navigator.serviceWorker.ready;

        // Verifica o status da permissão atual
        const permission = Notification.permission;
        
        if (permission === 'granted') {
            console.log('Permissão já concedida.');
            const subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
            await sendSubscriptionToServer(subscription);
            toast.success("Notificações já estão ativas!");
            return;
        }

        if (permission === 'denied') {
            toast.error("As notificações estão bloqueadas. Por favor, ative-as nas definições do seu navegador para este site.");
            return;
        }

        // Se a permissão for 'default', pede ao utilizador
        const newPermission = await Notification.requestPermission();
        if (newPermission === 'granted') {
            const subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
            await sendSubscriptionToServer(subscription);
            toast.success("Notificações ativadas com sucesso!");
        }

    } catch (error) {
        console.error("Erro ao subscrever para notificações push:", error);
        toast.error("Falha ao ativar as notificações.");
    }
}