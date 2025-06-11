import { HashGenerator } from '../tools/hash_generator.js';
import { addToHistory } from '../shared/workspace-logic.js';

export function initHashGeneratorPage() {
    const textInput = document.getElementById('hash-text-input');
    const fileInput = document.getElementById('hash-file-input');
    const fileNameDisplay = document.getElementById('file-name-display');
    const resultContainer = document.getElementById('resultado-hash');
    
    let debounceTimer;

    function renderHashes(hashes) {
        if (!resultContainer) return;
        if (!hashes) {
            resultContainer.innerHTML = '<p class="empty-state">O resultado dos hashes aparecerá aqui.</p>';
            resultContainer.classList.remove('has-content');
            return;
        }
        if (hashes.error) {
            resultContainer.innerHTML = `<p class="empty-state jwt-error">${hashes.error}</p>`;
            resultContainer.classList.add('has-content');
            return;
        }
        
        resultContainer.innerHTML = '';
        resultContainer.classList.add('has-content');
        Object.entries(hashes).forEach(([algo, hashValue]) => {
            const item = document.createElement('div');
            item.className = 'hash-result-item';
            item.innerHTML = `
                <div class="algo-name">${algo}</div>
                <div class="hash-value">
                    <span>${hashValue}</span>
                    <button class="copy-btn" title="Copiar" aria-label="Copiar Hash ${algo}">📋</button>
                </div>
            `;
            item.querySelector('.copy-btn').addEventListener('click', (e) => {
                navigator.clipboard.writeText(hashValue);
                const btn = e.currentTarget;
                const originalText = btn.innerHTML;
                btn.textContent = '✅';
                setTimeout(() => { btn.textContent = originalText; }, 1500);
            });
            resultContainer.appendChild(item);
        });
    }

    textInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const hashes = HashGenerator.generateFromText(textInput.value);
            renderHashes(hashes);
            if (textInput.value) {
                addToHistory('Hash de Texto', textInput.value.substring(0, 50) + '...', false);
            }
        }, 300);
    });

    fileInput.addEventListener('change', async (event) => {
        if (event.target.files.length === 0) {
            fileNameDisplay.textContent = 'Nenhum arquivo selecionado.';
            return;
        }

        const file = event.target.files[0];
        fileNameDisplay.textContent = `Arquivo: ${file.name}`;
        
        resultContainer.innerHTML = '<div class="spinner"></div>';
        resultContainer.classList.add('has-content');
        
        try {
            const hashes = await HashGenerator.generateFromFile(file);
            renderHashes(hashes);
            addToHistory(`Hash de Arquivo`, file.name, false);
        } catch (error) {
            renderHashes({ error: error.message });
        }
    });
}