import { renderNavbar, renderWorkspace, renderFooter } from './layout-renderer.js';
import { initializeTheme } from './theme-logic.js';
import { initializeWorkspace } from './workspace-logic.js';

/**
 * Configura a lógica de navegação geral, com foco na robustez do menu mobile.
 */
function setupNavigation() {
    // Adicionamos um listener no documento inteiro para lidar com os cliques do menu
    document.body.addEventListener('click', (e) => {
        const navMenu = document.getElementById('nav-menu');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

        if (!navMenu || !mobileMenuToggle) return;

        // Se o clique foi no botão "hamburger"
        if (mobileMenuToggle.contains(e.target)) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            // Fecha os submenus ao fechar o menu principal
            if (!navMenu.classList.contains('active')) {
                document.querySelectorAll('.dropdown.active').forEach(d => d.classList.remove('active'));
            }
            return;
        }

        // Se o clique foi em um toggle de dropdown dentro do menu mobile
        const dropdownToggle = e.target.closest('.dropdown-toggle');
        if (window.innerWidth <= 768 && dropdownToggle && navMenu.contains(dropdownToggle)) {
            const parentDropdown = dropdownToggle.parentElement;
            // Fecha outros dropdowns antes de abrir o novo
            document.querySelectorAll('.dropdown.active').forEach(d => {
                if (d !== parentDropdown) d.classList.remove('active');
            });
            parentDropdown.classList.toggle('active');
            return;
        }
        
        // Se o clique foi em um item de menu, fecha o menu principal
        if (e.target.classList.contains('dropdown-item')) {
             navMenu.classList.remove('active');
             document.querySelectorAll('.dropdown.active').forEach(d => d.classList.remove('active'));
             return;
        }

        // Se o clique foi fora do menu (no mobile), fecha o menu
        if (window.innerWidth <= 768 && navMenu.classList.contains('active') && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            document.querySelectorAll('.dropdown.active').forEach(d => d.classList.remove('active'));
        }
    });
}


/**
 * Função principal de inicialização do layout, chamada uma vez por página.
 */
async function initializeLayout() {
    // 1. Renderiza os componentes de layout nos placeholders do HTML
    renderNavbar('navbar-placeholder');
    renderWorkspace('workspace-placeholder');
    renderFooter('footer-placeholder');

    // 2. Ativa a lógica desses componentes compartilhados
    initializeTheme();
    initializeWorkspace();
    setupNavigation();
    
    // 3. Ativa a lógica específica da página atual
    const pageId = document.body.dataset.pageId;
    if (!pageId) return;

    try {
        const pageModule = await import(`../pages/${pageId}.js`);
        const functionName = `init${pageId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Page`;
        
        if (pageModule[functionName] && typeof pageModule[functionName] === 'function') {
            // Injeta as funções compartilhadas que a página da ferramenta pode precisar
            pageModule[functionName]({
                renderResult: window.NextDevs.renderResult,
                addToHistory: window.NextDevs.addToHistory,
                addToScenario: window.NextDevs.addToScenario,
                lastGeneratedData: window.NextDevs.lastGeneratedData,
                showSpinner: window.NextDevs.showSpinner,
                hideSpinner: window.NextDevs.hideSpinner,
                formatTimeAgo: window.NextDevs.formatTimeAgo
            });
        }
    } catch (error) {
        console.error(`Erro ao inicializar a página '${pageId}':`, error);
    }
}

// Garante que o objeto global NextDevs exista
window.NextDevs = window.NextDevs || {};

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

// Controlador de estado offline
class OfflineController {
    constructor() {
        this.isOffline = !navigator.onLine;
        this.currentPath = window.location.pathname;
        this.init();
    }

    async init() {
        // Verifica se o Service Worker está registrado
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                    updateViaCache: 'none'
                });
                
                // Verifica se há uma nova versão do Service Worker
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Nova versão disponível
                            if (confirm('Uma nova versão está disponível. Deseja atualizar agora?')) {
                                window.location.reload();
                            }
                        }
                    });
                });

                console.log('Service Worker registrado:', registration.scope);
            } catch (error) {
                console.error('Erro ao registrar Service Worker:', error);
            }
        }

        // Adiciona listeners para eventos online/offline
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));

        // Adiciona listener para mudanças de visibilidade (importante para mobile)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.checkOnlineStatus();
            }
        });

        // Verifica estado inicial
        this.handleOnlineStatus(navigator.onLine);
    }

    isOfflineTool(url) {
        // Remove parâmetros de query e hash para comparação
        const cleanUrl = url.split('?')[0].split('#')[0];
        return OFFLINE_TOOLS.some(tool => cleanUrl.endsWith(tool));
    }

    async checkOnlineStatus() {
        try {
            // Tenta fazer uma requisição leve para verificar a conexão
            const response = await fetch('/favicon.ico', {
                method: 'HEAD',
                cache: 'no-cache'
            });
            this.handleOnlineStatus(response.ok);
        } catch (error) {
            this.handleOnlineStatus(false);
        }
    }

    async handleOnlineStatus(isOnline) {
        this.isOffline = !isOnline;
        
        // Atualiza o estado visual se necessário
        if (document.body) {
            document.body.classList.toggle('offline', !isOnline);
        }

        if (!isOnline) {
            const currentPath = window.location.pathname;
            
            // Se não estiver na página offline e não for uma ferramenta offline
            if (currentPath !== '/offline.html' && !this.isOfflineTool(currentPath)) {
                try {
                    // Verifica se a página está no cache
                    const cache = await caches.open('nextdevs-static-v1');
                    const response = await cache.match(currentPath);
                    
                    // Se não estiver no cache, redireciona para offline.html
                    if (!response) {
                        // Verifica se a página offline está no cache
                        const offlinePage = await cache.match('/offline.html');
                        if (offlinePage) {
                            window.location.href = '/offline.html';
                        } else {
                            // Se a página offline não estiver no cache, tenta buscar
                            try {
                                const offlineResponse = await fetch('/offline.html', {
                                    credentials: 'same-origin',
                                    headers: {
                                        'Cache-Control': 'no-cache'
                                    }
                                });
                                if (offlineResponse.ok) {
                                    await cache.put('/offline.html', offlineResponse.clone());
                                    window.location.href = '/offline.html';
                                }
                            } catch (error) {
                                console.error('Erro ao buscar página offline:', error);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Erro ao verificar cache:', error);
                    window.location.href = '/offline.html';
                }
            }
        }
    }
}

// Inicializa o controlador offline
const offlineController = new OfflineController();

// Executa tudo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeLayout);