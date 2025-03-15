// Only register service worker in production
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.hostname !== 'localhost') {
    window.addEventListener('load', function () {
        try {
            navigator.serviceWorker.register('/sw.js')
                .then(function (registration) {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(function (error) {
                    console.log('Service Worker registration failed:', error);
                });
        } catch (error) {
            console.log('Error during Service Worker registration:', error);
        }
    });
} 