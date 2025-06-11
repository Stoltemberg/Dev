import { renderResult, addToHistory } from '../shared/workspace-logic.js';
import { Uuid } from '../tools/uuid.js';

export function initUuidPage() {
    const gerarBtn = document.getElementById('gerar-uuid');
    const quantidadeInput = document.getElementById('uuid-quantidade');
    const uppercaseCheckbox = document.getElementById('uuid-uppercase');
    const noHyphensCheckbox = document.getElementById('uuid-no-hyphens');
    const resultBoxId = 'resultado-uuid';

    function updateButtonText() {
        const quantidade = parseInt(quantidadeInput.value, 10) || 1;
        gerarBtn.textContent = quantidade > 1 ? `Gerar ${quantidade} UUIDs` : 'Gerar UUID';
    }
    
    function generateUuids() {
        const options = {
            count: parseInt(quantidadeInput.value, 10) || 1,
            uppercase: uppercaseCheckbox.checked,
            noHyphens: noHyphensCheckbox.checked
        };

        const uuids = Uuid.generate(options);
        const resultString = uuids.join('\n');
        
        renderResult(resultBoxId, resultString, true);
        addToHistory(options.count > 1 ? `${options.count} UUIDs` : 'UUID', resultString, false);
    }

    // Adiciona os event listeners
    quantidadeInput.addEventListener('input', updateButtonText);
    gerarBtn.addEventListener('click', generateUuids);

    // Inicia o texto do botão corretamente
    updateButtonText();
}