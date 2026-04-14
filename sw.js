const CACHE_NAME = 'vitalacuity-v2';

// Cache all important files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/app.html',
        '/manifest.json'
      ]);
    })
  );
});

// Serve cached files when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If offline and trying to load the app, show license expired page
      if (!response && event.request.url.includes('app.html')) {
        return new Response(`
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>VitalAcuity - License Expired</title>
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-zinc-950 text-white flex items-center justify-center min-h-screen">
              <div class="max-w-md mx-auto text-center px-6">
                <div class="text-6xl mb-6">🔒</div>
                <h1 class="text-3xl font-semibold mb-4">License Expired</h1>
                <p class="text-zinc-400 mb-8">Your VitalAcuity subscription has expired.</p>
                <p class="text-zinc-400 mb-10">Please renew your subscription to continue using the app.</p>
                <a href="https://vitalacuity.app" 
                   class="block bg-teal-600 hover:bg-teal-500 py-4 rounded-3xl text-white font-medium text-lg">
                  Renew Subscription
                </a>
              </div>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      return response || fetch(event.request);
    })
  );
});