importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAh0JpM0BqgCwxkhFG32m6VH6okQIiSops",
    authDomain: "felix-portfolio-8b3a8.firebaseapp.com",
    projectId: "felix-portfolio-8b3a8",
    storageBucket: "felix-portfolio-8b3a8.firebasestorage.app",
    messagingSenderId: "439075265698",
    appId: "1:439075265698:web:058c014a4f4c32a9444bfb"
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
    const { title, body, icon } = payload.notification;
    self.registration.showNotification(title, {
        body,
        icon: icon || '/felix/icon-192.png',
        badge: '/felix/icon-192.png',
        vibrate: [200, 100, 200],
        data: { url: 'https://felixodago5-arch.github.io/test/' }
    });
});

// Notification click — open the app
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data?.url || 'https://felixodago5-arch.github.io/test/')
    );
});
