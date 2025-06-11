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

// Executa tudo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeLayout);