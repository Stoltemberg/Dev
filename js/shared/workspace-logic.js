// =================================================================================
// ESTADO GLOBAL E VARIÁVEIS EXPORTADAS
// =================================================================================

// 'state' armazena todos os dados que serão salvos no navegador do usuário.
let state = {
    currentScenario: {},
    history: [],
    savedScenarios: []
};

// 'lastGeneratedData' armazena temporariamente o último dado gerado por uma ferramenta de cenário.
export let lastGeneratedData = {};

// =================================================================================
// FUNÇÕES DE UTILIDADE EXPORTÁVEIS (A "API" para as páginas de ferramentas)
// =================================================================================

/**
 * Renderiza um resultado em uma caixa de resultado, adicionando um botão de cópia.
 * @param {string} elementId - O ID do elemento da caixa de resultado.
 * @param {string} content - O conteúdo de texto a ser exibido.
 * @param {boolean} [isPreformatted=false] - Se o conteúdo deve usar uma tag <pre>.
 */
export function renderResult(elementId, content, isPreformatted = false) {
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
        copyButton.setAttribute('aria-label', 'Copiar para a área de transferência');
        copyButton.onclick = () => copyToClipboard(content, copyButton);
        resultBox.appendChild(copyButton);
    }
    resultBox.appendChild(textElement);
}

/**
 * Adiciona um item ao histórico do workspace e salva no localStorage.
 * @param {string} type - O tipo de dado gerado (ex: 'CPF', 'Senha').
 * @param {object|string} data - O dado gerado.
 * @param {boolean} isScenarioData - Se o item pode ser adicionado a um cenário.
 */
export function addToHistory(type, data, isScenarioData = false) {
    if (!state.history) state.history = [];
    state.history.unshift({ type, data, isScenarioData, timestamp: new Date() });
    if (state.history.length > 20) state.history.pop();
    saveState();
    renderHistory();
}

/**
 * Adiciona o último dado gerado de um tipo específico ao cenário atual.
 * @param {string} type - O tipo do dado a ser adicionado (ex: 'pessoa', 'cnpj').
 */
export function addToScenario(type) {
    const key = type.toLowerCase();
    if (lastGeneratedData[key]) {
        let scenarioKey = key.charAt(0).toUpperCase() + key.slice(1);
        if (state.currentScenario.Pessoa && ['cnpj', 'cnh', 'cartao'].includes(key)) {
             const nome = state.currentScenario.Pessoa.Nome.split(' ')[0];
             scenarioKey = `${scenarioKey} de ${nome}`;
        }
        state.currentScenario[scenarioKey] = lastGeneratedData[key];
        saveState();
        renderCurrentScenario();
        document.getElementById('workspace').classList.add('open');
        document.querySelector('.workspace-tab-btn[data-target="workspace-cenario"]').click();
    } else {
        alert(`Gere um dado do tipo "${type}" primeiro antes de adicionar ao cenário.`);
    }
}

/**
 * Mostra um spinner de carregamento em um botão.
 * @param {HTMLElement} button - O elemento do botão.
 */
export function showSpinner(button) {
    if(!button) return;
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = '<div class="spinner"></div>';
    button.classList.add('btn-loading');
}

/**
 * Esconde o spinner de carregamento de um botão.
 * @param {HTMLElement} button - O elemento do botão.
 */
export function hideSpinner(button) {
    if(!button) return;
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || 'Gerar';
    button.classList.remove('btn-loading');
}


// =================================================================================
// LÓGICA INTERNA (Privada ao Módulo)
// =================================================================================

function copyToClipboard(str, button) {
    navigator.clipboard.writeText(str).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copiado!';
        setTimeout(() => { button.textContent = originalText || '📋'; }, 1500);
    });
}

function saveState() {
    try {
        localStorage.setItem('devtools_state', JSON.stringify(state));
    } catch (e) {
        console.error("Erro ao salvar o estado:", e);
    }
}

function loadState() {
    const savedState = localStorage.getItem('devtools_state');
    if (savedState) {
        try {
            state = JSON.parse(savedState);
            if (!state.savedScenarios) state.savedScenarios = [];
            if (!state.history) state.history = [];
            if (!state.currentScenario) state.currentScenario = {};
        } catch {
            state = { currentScenario: {}, history: [], savedScenarios: [] };
        }
    }
    renderAll();
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return "agora mesmo";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
}

function renderCurrentScenario() {
    const container = document.getElementById('cenario-content');
    if (!container) return;
    container.innerHTML = '';
    if (Object.keys(state.currentScenario).length === 0) {
        container.innerHTML = '<p class="empty-state">Gere dados e clique em "Adicionar ao Cenário" para começar.</p>';
        return;
    }
    for (const [key, data] of Object.entries(state.currentScenario)) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cenario-item';
        const title = key.charAt(0).toUpperCase() + key.slice(1);
        const content = typeof data === 'object' ? Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n') : data;
        itemDiv.innerHTML = `<h4>${title}</h4><pre>${content}</pre>`;
        container.appendChild(itemDiv);
    }
}

function renderHistory() {
    const container = document.getElementById('historico-content');
    if (!container) return;
    container.innerHTML = '';
    if ((!state.history || state.history.length === 0) && (!state.savedScenarios || state.savedScenarios.length === 0)) {
        container.innerHTML = '<p class="empty-state">Seu histórico e cenários salvos aparecerão aqui.</p>';
        return;
    }
    if (state.savedScenarios && state.savedScenarios.length > 0) {
        let savedHtml = `<h4>Cenários Salvos</h4>`;
        state.savedScenarios.forEach((scenario, index) => {
            const content = Object.entries(scenario.data).map(([k, v]) => (typeof v === 'object' ? `${k}:\n  ${Object.entries(v).map(([sk,sv])=>`${sk}: ${sv}`).join('\n  ')}` : `${k}: ${v}`)).join('\n');
            savedHtml += `<div class="historico-item"><h4>${scenario.name} <button class="btn-danger" title="Excluir cenário" style="padding: 2px 8px; font-size: 0.8rem;" onclick="removeScenario(${index})">X</button></h4><pre>${content}</pre></div>`;
        });
        container.innerHTML += savedHtml;
    }
    if (state.history && state.history.length > 0) {
        let historyHtml = `<h4 style="margin-top: 1.5rem;">Últimos Itens Gerados</h4>`;
        state.history.forEach((item, index) => {
            const content = typeof item.data === 'object' ? Object.entries(item.data).map(([k,v])=>`${k}: ${v}`).join('\n') : String(item.data);
            historyHtml += `<div class="history-card">
                <div class="history-card-header"><span class="type">${item.type}</span><span class="timestamp">${formatTimeAgo(item.timestamp)}</span></div>
                <div class="history-card-body"><pre>${content}</pre></div>
                <div class="history-card-actions">
                    <button class="btn-icon" data-history-copy-index="${index}">Copiar</button>
                    ${item.isScenarioData ? `<button class="btn-icon" data-history-add-index="${index}">+ Cenário</button>` : ''}
                </div>
            </div>`;
        });
        container.innerHTML += historyHtml;
    }
}

function renderAll() {
    renderCurrentScenario();
    renderHistory();
}

window.removeScenario = function(index) {
    if (confirm(`Tem certeza que deseja excluir o cenário "${state.savedScenarios[index].name}"?`)) {
        state.savedScenarios.splice(index, 1);
        saveState();
        renderHistory();
    }
};

// =================================================================================
// FUNÇÃO DE INICIALIZAÇÃO PRINCIPAL DO WORKSPACE
// =================================================================================
export function initializeWorkspace() {
    const workspace = document.getElementById('workspace');
    if (!workspace) return;

    loadState(); // Carrega os dados salvos do localStorage

    document.getElementById('workspace-toggle-btn').addEventListener('click', () => workspace.classList.add('open'));
    document.getElementById('workspace-close-btn').addEventListener('click', () => workspace.classList.remove('open'));

    document.querySelectorAll('.workspace-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.workspace-tab-btn, .workspace-pane').forEach(el => el.classList.remove('active'));
            e.currentTarget.classList.add('active');
            document.getElementById(e.currentTarget.dataset.target).classList.add('active');
        });
    });

    document.getElementById('clear-cenario-btn').addEventListener('click', () => {
        if (Object.keys(state.currentScenario).length > 0 && confirm("Tem certeza que deseja limpar o cenário atual?")) {
            state.currentScenario = {};
            saveState();
            renderAll();
        }
    });

    document.getElementById('save-cenario-btn').addEventListener('click', () => {
        if (Object.keys(state.currentScenario).length > 0) {
            const scenarioName = prompt("Digite um nome para este cenário:", `Cenário ${state.savedScenarios.length + 1}`);
            if (scenarioName) {
                state.savedScenarios.unshift({ name: scenarioName, data: { ...state.currentScenario } });
                state.currentScenario = {};
                saveState();
                renderAll();
            }
        } else { alert("O cenário atual está vazio."); }
    });

    document.getElementById('export-cenario-btn').addEventListener('click', () => {
        if (Object.keys(state.currentScenario).length === 0) { alert("O cenário atual está vazio."); return; }
        const dataStr = JSON.stringify(state.currentScenario, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `cenario-nextdevs.json`; a.click(); URL.revokeObjectURL(url);
    });

    const importFileInput = document.getElementById('import-file-input');
    document.getElementById('import-cenario-btn').addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedScenario = JSON.parse(e.target.result);
                if (confirm("Isso substituirá seu cenário atual. Deseja continuar?")) {
                    state.currentScenario = importedScenario;
                    saveState();
                    renderAll();
                    workspace.classList.add('open');
                }
            } catch (error) { alert("Arquivo JSON inválido."); }
        };
        reader.readAsText(file); event.target.value = '';
    });

    // Delegação de eventos para ações nos cards do histórico
    document.getElementById('historico-content').addEventListener('click', (e) => {
        const copyBtn = e.target.closest('[data-history-copy-index]');
        const addBtn = e.target.closest('[data-history-add-index]');
        if (copyBtn) {
            const item = state.history[parseInt(copyBtn.dataset.historyCopyIndex, 10)];
            const contentToCopy = typeof item.data === 'object' ? Object.entries(item.data).map(([k,v])=>`${k}: ${v}`).join('\n') : item.data;
            copyToClipboard(contentToCopy, copyBtn);
        }
        if (addBtn) {
            const item = state.history[parseInt(addBtn.dataset.historyAddIndex, 10)];
            lastGeneratedData[item.type.toLowerCase().replace(/ /g, '-')] = item.data;
            addToScenario(item.type.toLowerCase().replace(/ /g, '-'));
        }
    });
}