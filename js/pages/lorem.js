import { renderResult, addToHistory } from '../shared/workspace-logic.js';
import { Lorem } from '../tools/lorem.js';

export function initLoremPage() {
    const gerarBtn = document.getElementById('gerar-lorem');
    const quantidadeInput = document.getElementById('lorem-quantidade');
    const startWithLoremCheckbox = document.getElementById('lorem-start-option');
    const pTagsCheckbox = document.getElementById('lorem-p-tags-option');
    const resultBoxId = 'resultado-lorem';

    gerarBtn.addEventListener('click', () => {
        const generationType = document.querySelector('input[name="lorem-type"]:checked').value;

        const options = {
            type: generationType,
            count: quantidadeInput.value,
            startWithLorem: startWithLoremCheckbox.checked,
            wrapInPTags: pTagsCheckbox.checked
        };
        
        const resultText = Lorem.generate(options);

        renderResult(resultBoxId, resultText, true); // true para usar <pre> e respeitar quebras de linha
        addToHistory('Lorem Ipsum', `${options.count} ${options.type}`, false);
    });
}