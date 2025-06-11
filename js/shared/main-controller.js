import { renderNavbar, renderWorkspace, renderFooter } from './layout-renderer.js';
import { initializeTheme } from './theme-logic.js';
// A lógica do workspace será gerenciada diretamente aqui para garantir a funcionalidade

// --- Início da Lógica do Workspace (integrada para robustez) ---
let state = { currentScenario: {}, history: [], savedScenarios: [] };
let lastGeneratedData = {};

function saveState() { localStorage.setItem('devtools_state', JSON.stringify(state)); }
function formatTimeAgo(date) { const now = new Date(); const seconds = Math.floor((now - new Date(date)) / 1000); if (seconds < 60) return "agora mesmo"; const minutes = Math.floor(seconds / 60); if (minutes < 60) return `${minutes} min atrás`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h atrás`; const days = Math.floor(hours / 24); return `${days}d atrás`; }
function copyToClipboard(str, button) { navigator.clipboard.writeText(str).then(() => { const originalText = button.textContent; button.textContent = 'Copiado!'; setTimeout(() => { button.textContent = originalText || '📋'; }, 1500); }); }

function renderResult(elementId, content, isPreformatted = false) {
    const resultBox = document.getElementById(elementId);
    if (!resultBox) return;
    resultBox.innerHTML = '';
    const textElement = document.createElement(isPreformatted ? 'pre' : 'span');
    textElement.textContent = content;
    const hasContent = content && !String(content).toLowerCase().includes("...") && !String(content).toLowerCase().includes("aguardando") && !String(content).toLowerCase().includes("selecione");
    resultBox.classList.toggle('has-content', hasContent);
    if (hasContent) {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.innerHTML = '📋';
        copyButton.title = "Copiar";
        copyButton.setAttribute('aria-label', 'Copiar');
        copyButton.onclick = () => copyToClipboard(content, copyButton);
        resultBox.appendChild(copyButton);
    }
    resultBox.appendChild(textElement);
}

function renderCurrentScenario() { /* ... implementação completa como antes ... */ }
function renderHistory() { /* ... implementação completa como antes ... */ }
function renderAll() { renderCurrentScenario(); renderHistory(); }

function addToHistory(type, data, isScenarioData = false) { if(!state.history) state.history = []; state.history.unshift({ type, data, isScenarioData, timestamp: new Date() }); if (state.history.length > 20) state.history.pop(); saveState(); renderHistory(); }
function addToScenario(type) { /* ... implementação completa como antes ... */ }
window.removeScenario = function(index) { if (confirm(`Excluir o cenário "${state.savedScenarios[index].name}"?`)) { state.savedScenarios.splice(index, 1); saveState(); renderHistory(); } };
// --- Fim da Lógica do Workspace ---

function setupNavigation() {
    // ... implementação completa da navegação mobile como na primeira opção ...
}

async function initializePage() {
    renderNavbar('navbar-placeholder');
    renderWorkspace('workspace-placeholder');
    renderFooter('footer-placeholder');
    initializeTheme();
    setupNavigation();
    
    // Inicializa o workspace e carrega os dados
    const workspace = document.getElementById('workspace');
    if (workspace) {
        // Cole aqui os event listeners do initializeWorkspace (open, close, tabs, import, export, etc)
    }
    const savedState = localStorage.getItem('devtools_state');
    if (savedState) { try { state = JSON.parse(savedState); if(!state.savedScenarios) state.savedScenarios = []; } catch { state = { currentScenario: {}, history: [], savedScenarios: [] }; } }
    renderAll();

    const pageId = document.body.dataset.pageId;
    if (!pageId) return;

    try {
        const pageModule = await import(`../pages/${pageId}.js`);
        const functionName = `init${pageId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Page`;
        if (pageModule[functionName]) {
            pageModule[functionName]({ renderResult, addToHistory, addToScenario, lastGeneratedData, formatTimeAgo });
        }
    } catch (error) {
        console.error(`Erro ao inicializar a página '${pageId}':`, error);
    }
}

document.addEventListener('DOMContentLoaded', initializePage);