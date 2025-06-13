const CACHE_NAME = 'nextdevs-v1';
const STATIC_CACHE = 'nextdevs-static-v1';
const DYNAMIC_CACHE = 'nextdevs-dynamic-v1';

// Recursos que devem ser cacheados na instalação
const STATIC_ASSETS = [
    // Páginas principais
    '/',
    '/index.html',
    '/offline.html',
    
    // Páginas de ferramentas offline
    '/html/validador-docs.html',
    '/html/gerador-cpf.html',
    '/html/gerador-cnpj.html',
    '/html/gerador-cnh.html',
    '/html/gerador-pessoa.html',
    '/html/contador.html',
    '/html/code-formatter.html',
    '/html/url-encoder.html',
    '/html/regex-tester.html',
    '/html/jwt-debugger.html',
    
    // Recursos compartilhados
    '/css/themes.css',
    '/css/layout.css',
    '/css/style.css',
    '/css/tools/validator.css',
    '/css/tools/cpf.css',
    '/css/tools/cnh.css',
    '/css/tools/pessoa.css',
    '/css/tools/contador.css',
    '/css/tools/code-formatter.css',
    '/css/tools/url-encoder.css',
    '/css/tools/regex.css',
    '/css/tools/jwt.css',
    
    // Scripts
    '/js/shared/theme-controller.js',
    '/js/shared/main-controller.js',
    '/js/shared/workspace-logic.js',
    '/js/pages/home.js',
    '/js/pages/validator.js',
    '/js/pages/cpf.js',
    '/js/pages/cnpj.js',
    '/js/pages/cnh.js',
    '/js/pages/pessoa.js',
    '/js/pages/contador.js',
    '/js/pages/code-formatter.js',
    '/js/pages/url-encoder.js',
    '/js/pages/regex.js',
    '/js/pages/jwt.js',
    
    // Outros recursos
    '/manifest.json',
    '/favicon.ico'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            // Cache dos recursos estáticos
            caches.open(STATIC_CACHE).then(async (cache) => {
                console.log('Cache estático aberto');
                // Tenta fazer cache de todos os recursos
                const results = await Promise.allSettled(
                    STATIC_ASSETS.map(url => 
                        fetch(url)
                            .then(response => {
                                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                                return cache.put(url, response);
                            })
                            .catch(error => {
                                console.error(`Erro ao fazer cache de ${url}:`, error);
                                return null;
                            })
                    )
                );
                
                // Log dos resultados
                const successful = results.filter(r => r.status === 'fulfilled').length;
                const failed = results.filter(r => r.status === 'rejected').length;
                console.log(`Cache concluído: ${successful} sucessos, ${failed} falhas`);
                
                return cache;
            }),
            // Cache dinâmico vazio
            caches.open(DYNAMIC_CACHE)
        ]).then(() => {
            console.log('Service Worker instalado e caches criados');
            return self.skipWaiting();
        })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Limpa caches antigos
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Cache antigo removido:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Toma controle de todas as páginas abertas
            self.clients.claim(),
            // Limpa o cache dinâmico periodicamente
            cleanupDynamicCache()
        ])
    );
});

// Limpeza periódica do cache dinâmico
async function cleanupDynamicCache() {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    const now = Date.now();
    
    // Remove itens mais antigos que 7 dias
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    await Promise.all(
        requests.map(async (request) => {
            const response = await cache.match(request);
            const date = response.headers.get('date');
            if (date && new Date(date).getTime() < weekAgo) {
                return cache.delete(request);
            }
        })
    );
}

// Estratégia de cache: Cache First com fallback para rede
async function cacheFirstWithNetworkFallback(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        // Atualiza o cache em background
        fetch(request).then(async (response) => {
            if (response.ok) {
                const cache = await caches.open(DYNAMIC_CACHE);
                await cache.put(request, response.clone());
            }
        }).catch(() => {
            // Ignora erros de fetch em background
        });
        return cachedResponse;
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        // Se for uma navegação, retorna a página offline
        if (request.mode === 'navigate') {
            return caches.match('/offline.html');
        }
        throw error;
    }
}

// Estratégia de cache: Network First com fallback para cache
async function networkFirstWithCacheFallback(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        if (request.mode === 'navigate') {
            return caches.match('/offline.html');
        }
        throw error;
    }
}

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
    const request = event.request;
    
    // Ignora requisições não GET
    if (request.method !== 'GET') {
        return;
    }

    // URLs que devem usar Network First
    const networkFirstUrls = [
        '/api/',
        '/search',
        '/tools/'
    ];

    // URLs que devem usar Cache First
    const cacheFirstUrls = [
        '/css/',
        '/js/',
        '/images/',
        '/icons/',
        '/fonts/',
        '/html/'  // Adicionado para garantir que as páginas HTML usem Cache First
    ];

    // Determina a estratégia de cache baseado na URL
    if (networkFirstUrls.some(url => request.url.includes(url))) {
        event.respondWith(networkFirstWithCacheFallback(request));
    } else if (cacheFirstUrls.some(url => request.url.includes(url))) {
        event.respondWith(cacheFirstWithNetworkFallback(request));
    } else {
        // Estratégia padrão: Cache First para navegação, Network First para outros recursos
        if (request.mode === 'navigate') {
            event.respondWith(cacheFirstWithNetworkFallback(request));
        } else {
            event.respondWith(networkFirstWithCacheFallback(request));
        }
    }
});

// Sincronização em background
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

// Notificações push
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver mais',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/icons/close.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('NextDevs', options)
    );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Função para sincronizar dados em background
async function syncData() {
    try {
        // Implementar lógica de sincronização aqui
        // Por exemplo, enviar dados salvos offline para o servidor
        const db = await openDB();
        const pendingData = await db.getAll('pendingData');
        
        for (const data of pendingData) {
            try {
                const response = await fetch('/api/sync', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    await db.delete('pendingData', data.id);
                }
            } catch (error) {
                console.error('Erro ao sincronizar dados:', error);
            }
        }
    } catch (error) {
        console.error('Erro na sincronização:', error);
    }
}

// Função auxiliar para abrir o banco de dados IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('nextdevs-offline', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('pendingData')) {
                db.createObjectStore('pendingData', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
} 