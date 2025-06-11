import { Contador } from '../tools/contador.js';

export function initContadorPage() {
    const textInput = document.getElementById('contador-input');
    const resultGrid = document.getElementById('resultado-contador');

    function updateStats() {
        const text = textInput.value;
        const stats = Contador.count(text);

        resultGrid.innerHTML = ''; // Limpa os cards antigos

        for (const [label, value] of Object.entries(stats)) {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `
                <div class="stat-value">${value}</div>
                <div class="stat-label">${label}</div>
            `;
            resultGrid.appendChild(card);
        }
    }

    if (textInput) {
        textInput.addEventListener('input', updateStats);
        // Executa na carga inicial para mostrar os cards zerados
        updateStats();
    }
}