const CACHE_NAME = 'nextdevs-v1';
const STATIC_CACHE = 'nextdevs-static-v1';
const DYNAMIC_CACHE = 'nextdevs-dynamic-v1';

// Lista de ferramentas que funcionam offline
const OFFLINE_TOOLS = [
    '/html/validador-docs.html',
    '/html/gerador-cpf.html',
    '/html/gerador-cnpj.html',
    '/html/gerador-cnh.html',
    '/html/gerador-pessoa.html',
    '/html/contador.html',
    '/html/code-formatter.html',
    '/html/url-encoder.html',
    '/html/regex-tester.html',
    '/html/jwt-debugger.html'
];

// Função para verificar se a URL é uma ferramenta offline
function isOfflineTool(url) {
    // Remove parâmetros de query e hash para comparação
    const cleanUrl = url.split('?')[0].split('#')[0];
    return OFFLINE_TOOLS.some(tool => cleanUrl.endsWith(tool));
}

// Função para verificar se é uma requisição de navegação
function isNavigationRequest(request) {
    return request.mode === 'navigate' || 
           (request.headers.get('accept') || '').includes('text/html');
}

// Recursos que devem ser cacheados na instalação
const STATIC_ASSETS = [
    // Páginas principais
    '/',
    '/index.html',
    '/offline.html',
    
    // Páginas de ferramentas offline
    ...OFFLINE_TOOLS,
    
    // Recursos compartilhados
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
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Cache estático aberto');
                // Usa Promise.allSettled para continuar mesmo se alguns recursos falharem
                return Promise.allSettled(
                    STATIC_ASSETS.map(url => 
                        fetch(url, { credentials: 'same-origin' })
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
            })
            .then(() => {
                console.log('Recursos estáticos cacheados');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Erro ao fazer cache dos recursos:', error);
            })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Limpa caches antigos
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Cache antigo removido:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Toma controle de todas as páginas abertas
            self.clients.claim()
        ])
    );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Ignora requisições não GET
    if (request.method !== 'GET') {
        return;
    }

    // Se for uma navegação
    if (isNavigationRequest(request)) {
        event.respondWith(
            (async () => {
                try {
                    // Tenta buscar da rede primeiro
                    const response = await fetch(request, { 
                        credentials: 'same-origin',
                        headers: {
                            'Cache-Control': 'no-cache'
                        }
                    });
                    
                    // Se for uma ferramenta offline, salva no cache
                    if (isOfflineTool(request.url)) {
                        const cache = await caches.open(STATIC_CACHE);
                        await cache.put(request, response.clone());
                    }
                    
                    return response;
                } catch (error) {
                    // Se estiver offline
                    if (!navigator.onLine) {
                        // Se for uma ferramenta offline, verifica se está no cache
                        if (isOfflineTool(request.url)) {
                            const cache = await caches.open(STATIC_CACHE);
                            const cachedResponse = await cache.match(request);
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                        }
                        // Se não for uma ferramenta offline ou não estiver no cache, redireciona para offline.html
                        const offlinePage = await caches.match('/offline.html');
                        if (offlinePage) {
                            return offlinePage;
                        }
                        // Se a página offline não estiver no cache, tenta buscar
                        try {
                            const response = await fetch('/offline.html', { 
                                credentials: 'same-origin',
                                headers: {
                                    'Cache-Control': 'no-cache'
                                }
                            });
                            if (response.ok) {
                                const cache = await caches.open(STATIC_CACHE);
                                await cache.put('/offline.html', response.clone());
                                return response;
                            }
                        } catch (e) {
                            console.error('Erro ao buscar página offline:', e);
                        }
                    }
                    throw error;
                }
            })()
        );
        return;
    }

    // Para outros recursos, usa Cache First com fallback para rede
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Atualiza o cache em background
                    fetch(request, { 
                        credentials: 'same-origin',
                        headers: {
                            'Cache-Control': 'no-cache'
                        }
                    })
                        .then(response => {
                            if (response.ok) {
                                caches.open(DYNAMIC_CACHE)
                                    .then(cache => cache.put(request, response));
                            }
                        })
                        .catch(() => {
                            // Ignora erros de fetch em background
                        });
                    return cachedResponse;
                }

                // Se não estiver no cache, tenta buscar da rede
                return fetch(request, { 
                    credentials: 'same-origin',
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                })
                    .then(response => {
                        // Se a resposta for válida, salva no cache
                        if (response.ok) {
                            const responseToCache = response.clone();
                            caches.open(DYNAMIC_CACHE)
                                .then(cache => cache.put(request, responseToCache));
                        }
                        return response;
                    })
                    .catch(error => {
                        // Se for uma navegação e falhar, retorna a página offline
                        if (isNavigationRequest(request)) {
                            return caches.match('/offline.html');
                        }
                        throw error;
                    });
            })
    );
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

// Melhoria na limpeza do cache dinâmico
async function cleanupDynamicCache() {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    const now = Date.now();
    
    // Remove itens mais antigos que 7 dias
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    // Limita o tamanho total do cache
    const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
    let totalSize = 0;
    const cacheEntries = [];
    
    for (const request of requests) {
        const response = await cache.match(request);
        if (!response) continue;
        
        const date = response.headers.get('date');
        const size = response.headers.get('content-length') || 0;
        
        cacheEntries.push({
            request,
            date: date ? new Date(date).getTime() : 0,
            size: parseInt(size, 10)
        });
        
        totalSize += parseInt(size, 10);
    }
    
    // Ordena por data (mais antigos primeiro)
    cacheEntries.sort((a, b) => a.date - b.date);
    
    // Remove itens até que o cache esteja dentro do limite
    for (const entry of cacheEntries) {
        if (entry.date < weekAgo || totalSize > MAX_CACHE_SIZE) {
            await cache.delete(entry.request);
            totalSize -= entry.size;
        }
    }
} 