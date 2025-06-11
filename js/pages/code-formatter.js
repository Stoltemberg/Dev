import { CodeFormatter } from '../tools/code_formatter.js';
import { addToHistory } from '../shared/workspace-logic.js';

export function initCodeFormatterPage() {
    const languageSelect = document.getElementById('code-language-select');
    const codeInput = document.getElementById('code-input');
    const resultElement = document.getElementById('resultado-code-formatter');
    
    let debounceTimer;

    async function formatAndRender() {
        const language = languageSelect.value;
        const code = codeInput.value;
        
        const result = await CodeFormatter.format(code, language);

        // Limpa classes de linguagem antigas e adiciona a nova
        resultElement.className = '';
        resultElement.classList.add(`language-${language}`);

        if (result.error) {
            resultElement.textContent = result.error;
            resultElement.classList.add('jwt-error'); // Reutiliza a classe de erro para feedback visual
        } else {
            resultElement.textContent = result.formattedCode;
            // Garante que o highlight.js existe antes de usá-lo
            if (window.hljs) {
                hljs.highlightElement(resultElement);
            }
            // Adiciona ao histórico apenas se a formatação for bem-sucedida e houver código
            if (code.trim()) {
                addToHistory(`Código ${language.toUpperCase()} Formatado`, '...', false);
            }
        }
    }
    
    // Função para rodar a formatação com um pequeno delay após o usuário parar de digitar
    function handleInput() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(formatAndRender, 300);
    }
    
    if(codeInput && languageSelect && resultElement) {
        codeInput.addEventListener('input', handleInput);
        languageSelect.addEventListener('change', formatAndRender);

        // Formata o código inicial se houver algum
        if (codeInput.value) {
            formatAndRender();
        }
    }
}