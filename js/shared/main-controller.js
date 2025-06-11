import { renderNavbar, renderWorkspace, renderFooter } from './layout-renderer.js';
import { initializeTheme } from './theme-logic.js';
import { initializeWorkspace } from './workspace-logic.js';
// Os imports das páginas individuais não são mais necessários aqui

function setupNavigation() {
    // ... A função setupNavigation continua a mesma da versão anterior ...
}

async function initializePageLogic() {
    const pageId = document.body.dataset.pageId;
    console.log(`[main-controller] Procurando lógica para a página com id: '${pageId}'`);

    if (!pageId) {
        console.log("[main-controller] Nenhum pageId encontrado no body. Nenhuma lógica de página será executada.");
        return;
    }

    try {
        const pageModulePath = `../pages/${pageId}.js`;
        console.log(`[main-controller] Tentando importar dinamicamente o módulo: ${pageModulePath}`);
        const pageModule = await import(pageModulePath);
        console.log(`[main-controller] Módulo '${pageId}.js' carregado com sucesso.`);

        const functionName = `init${pageId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Page`;
        console.log(`[main-controller] Procurando pela função de inicialização: '${functionName}'`);

        if (pageModule[functionName] && typeof pageModule[functionName] === 'function') {
            console.log(`[main-controller] Função '${functionName}' encontrada. Executando agora...`);
            pageModule[functionName]();
        } else {
            console.warn(`[main-controller] AVISO: Função de inicialização '${functionName}' não foi encontrada ou não é uma função no módulo 'js/pages/${pageId}.js'.`);
        }
    } catch (error) {
        console.error(`[main-controller] ERRO CRÍTICO ao carregar ou inicializar o módulo para a página '${pageId}':`, error);
    }
}

function initializeLayout() {
    console.log("[main-controller] Iniciando o layout...");
    renderNavbar('navbar-placeholder');
    renderWorkspace('workspace-placeholder');
    renderFooter('footer-placeholder');
    initializeTheme();
    initializeWorkspace();
    setupNavigation();
    initializePageLogic();
    console.log("[main-controller] Layout finalizado.");
}

document.addEventListener('DOMContentLoaded', initializeLayout);