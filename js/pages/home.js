import { tools } from '../shared/tool-manifest.js';

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('tool-hub-grid');
    const searchBar = document.getElementById('tool-search-bar');

    function renderGrid(filter = '') {
        const lowerCaseFilter = filter.toLowerCase().trim();
        if (!grid) return;
        
        grid.innerHTML = '';
        
        const filteredTools = tools.filter(tool => 
            tool.name.toLowerCase().includes(lowerCaseFilter) || 
            tool.desc.toLowerCase().includes(lowerCaseFilter) ||
            tool.tags.some(tag => tag.includes(lowerCaseFilter))
        );

        if (filteredTools.length === 0) {
            grid.innerHTML = `<p class="empty-state">Nenhuma ferramenta encontrada para "${filter}"</p>`;
            return;
        }

        filteredTools.forEach(tool => {
            const card = document.createElement('a');
            card.href = tool.url;
            card.className = 'tool-card';
            card.innerHTML = `
                <h3>${tool.name}</h3>
                <p>${tool.desc}</p>
            `;
            grid.appendChild(card);
        });
    }

    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            renderGrid(e.target.value);
        });
        renderGrid(); // Renderização inicial
    }
});