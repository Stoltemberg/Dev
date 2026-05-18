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
                    <button id="workspace-toggle-btn" class="nav-icon-btn" title="Área de Trabalho" aria-label="Abrir área de trabalho"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></button>
                    <button id="theme-switcher" class="nav-icon-btn" title="Mudar Tema" aria-label="Mudar tema de cores"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></button>
                </div>
                <button id="mobile-menu-toggle" class="nav-icon-btn mobile-only" aria-label="Abrir menu de navegação"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>
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