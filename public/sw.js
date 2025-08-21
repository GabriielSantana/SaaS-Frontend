// public/sw.js - VERSÃO MELHORADA

self.addEventListener('push', event => {
  let notificationData = {
    title: 'Nova Notificação',
    body: 'Você recebeu uma nova mensagem.',
    icon: '/G2Icon 2.png', // Verifique se este ícone existe na sua pasta public
    url: '/'
  };

  // Tenta ler os dados como JSON.
  try {
    const data = event.data.json();
    notificationData.title = data.title;
    notificationData.body = data.body;
    notificationData.url = data.url;
  } catch (e) {
    // Se falhar (porque é texto puro), usa o texto como corpo da notificação.
    notificationData.body = event.data.text();
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    data: {
        url: notificationData.url
    }
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});