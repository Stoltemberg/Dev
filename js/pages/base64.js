import { Base64 } from '../tools/base64.js';
import { addToHistory } from '../shared/workspace-logic.js';

export function initBase64Page() {
    const decodedInput = document.getElementById('base64-decoded-input');
    const encodedInput = document.getElementById('base64-encoded-input');
    const decodedCounter = document.getElementById('decoded-char-count');
    const encodedCounter = document.getElementById('encoded-char-count');

    let isUpdating = false; // Flag para evitar loops infinitos

    function updateCounters() {
        decodedCounter.textContent = `Tamanho: ${decodedInput.value.length}`;
        encodedCounter.textContent = `Tamanho: ${encodedInput.value.length}`;
    }

    decodedInput.addEventListener('input', () => {
        if (isUpdating) return;
        isUpdating = true;
        
        const encodedText = Base64.encode(decodedInput.value);
        encodedInput.value = encodedText;
        addToHistory('Base64 (Codificado)', decodedInput.value, false);
        
        updateCounters();
        isUpdating = false;
    });

    encodedInput.addEventListener('input', () => {
        if (isUpdating) return;
        isUpdating = true;

        const decodedText = Base64.decode(encodedInput.value);
        decodedInput.value = decodedText;
        // Não adicionamos ao histórico na decodificação para evitar duplicatas
        
        updateCounters();
        isUpdating = false;
    });

    // Inicia os contadores
    updateCounters();
}