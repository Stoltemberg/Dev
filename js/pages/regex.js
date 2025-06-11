import { RegexTester } from '../tools/regex_tester.js';
// Não precisamos de helpers do workspace para esta ferramenta interativa

export function initRegexPage() {
    const patternInput = document.getElementById('regex-pattern');
    const flagsInput = document.getElementById('regex-flags');
    const testStringTextarea = document.getElementById('regex-test-string');
    const highlightBox = document.getElementById('resultado-regex-highlight');
    const matchesBox = document.getElementById('resultado-regex-matches');

    function runRegexTest() {
        const pattern = patternInput.value;
        const flags = flagsInput.value;
        const testString = testStringTextarea.value;
        
        const result = RegexTester.test(pattern, flags, testString);

        if (result.error) {
            highlightBox.innerHTML = `<span class="regex-error">${result.error}</span>`;
            matchesBox.innerHTML = `<span>Erro na expressão.</span>`;
        } else {
            highlightBox.innerHTML = result.highlightedHtml || '<span>Aguardando texto...</span>';
            
            const matchesHeaderText = `Correspondências encontradas: ${result.matchCount}`;
            const matchesList = result.matches.slice(0, 100).join('\n'); // Limita a 100 para performance
            matchesBox.innerHTML = `<pre>${matchesHeaderText}\n\n${matchesList}</pre>`;
        }
    }

    // Adiciona listeners para rodar o teste em tempo real
    patternInput.addEventListener('input', runRegexTest);
    flagsInput.addEventListener('input', runRegexTest);
    testStringTextarea.addEventListener('input', runRegexTest);

    // Executa uma vez na carga para inicializar a UI
    runRegexTest();
}