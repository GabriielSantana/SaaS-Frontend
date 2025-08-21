// public/sw.js

self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/G2Icon 2.png', // Caminho para um ícone na sua pasta public
    data: {
        url: data.url // Guarda a URL para usar no clique
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    // Abre a URL que guardámos quando a notificação foi criada
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});