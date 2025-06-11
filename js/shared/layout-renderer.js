import { tools } from './tool-manifest.js';

function getGroupedTools() {
    const categories = ['Documentos', 'Desenvolvimento', 'Web & Texto', 'Utilitários'];
    const grouped = categories.reduce((acc, category) => {
        const toolsInCategory = tools.filter(tool => tool.category === category);
        if (toolsInCategory.length > 0) {
            acc[category] = toolsInCategory;
        }
        return acc;
    }, {});
    return grouped;
}

export function renderNavbar(placeholderId) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    const groupedTools = getGroupedTools();
    let dropdownsHtml = '';

    for (const category in groupedTools) {
        dropdownsHtml += `
            <div class="nav-item dropdown">
                <button class="dropdown-toggle">${category}</button>
                <div class="dropdown-menu">
                    ${groupedTools[category].map(tool => `<a href="/${tool.url}" class="dropdown-item">${tool.name}</a>`).join('')}
                </div>
            </div>
        `;
    }

    placeholder.innerHTML = `
        <nav id="main-nav" class="main-nav">
            <div class="nav-content">
                <a href="/index.html" class="nav-brand">NextDevs</a>
                <div id="nav-menu" class="nav-menu" role="menu">${dropdownsHtml}</div>
                <div class="nav-actions">
                    <button id="workspace-toggle-btn" class="nav-icon-btn" title="Área de Trabalho" aria-label="Abrir área de trabalho">💼</button>
                    <button id="theme-switcher" class="nav-icon-btn" title="Mudar Tema" aria-label="Mudar tema de cores">☀️</button>
                </div>
                <button id="mobile-menu-toggle" class="nav-icon-btn mobile-only" aria-label="Abrir menu de navegação">☰</button>
            </div>
        </nav>
    `;
}

export function renderFooter(placeholderId) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;
    placeholder.innerHTML = `<p>&copy; ${new Date().getFullYear()} NextDevs. Construído para acelerar o desenvolvimento.</p>`;
}

export function renderWorkspace(placeholderId) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;
    placeholder.innerHTML = `
        <div id="workspace" class="workspace" role="complementary" aria-labelledby="workspace-title">
            <div class="workspace-header"><h3 id="workspace-title">Área de Trabalho</h3><button id="workspace-close-btn" class="workspace-close-btn" aria-label="Fechar área de trabalho">&times;</button></div>
            <div class="workspace-tabs"><button class="workspace-tab-btn active" data-target="workspace-cenario" role="tab">Cenário Atual</button><button class="workspace-tab-btn" data-target="workspace-historico" role="tab">Histórico</button></div>
            <div class="workspace-content">
                <div id="workspace-cenario" class="workspace-pane active" role="tabpanel"><div id="cenario-content" class="cenario-content-area"></div><div class="cenario-actions"><button id="import-cenario-btn" class="btn-secondary">Importar</button><button id="export-cenario-btn" class="btn-secondary">Exportar</button><button id="save-cenario-btn" class="btn-secondary">Salvar</button><button id="clear-cenario-btn" class="btn-danger">Limpar</button></div><input type="file" id="import-file-input" accept=".json" class="sr-only" aria-label="Importar arquivo de cenário"></div>
                <div id="workspace-historico" class="workspace-pane" role="tabpanel"><div id="historico-content" class="historico-content-area"></div></div>
            </div>
        </div>
    `;
}