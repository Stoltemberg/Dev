import { renderResult, addToHistory, addToScenario, lastGeneratedData } from '../shared/workspace-logic.js';
import { Cnh } from '../tools/cnh.js';

document.addEventListener('DOMContentLoaded', () => {
    const gerarBtn = document.getElementById('gerar-cnh');
    const formatacaoCheckbox = document.getElementById('cnh-formatacao');
    const resultBoxId = 'resultado-cnh';
    const addToScenarioBtn = document.getElementById('add-cnh-to-cenario');

    gerarBtn.addEventListener('click', () => {
        const comFormatacao = formatacaoCheckbox.checked;
        const dadosCnh = Cnh.generate(comFormatacao);

        // Armazena o último dado gerado para ser usado pelo Workspace
        lastGeneratedData.cnh = dadosCnh;

        // Formata o objeto para exibição
        const resultString = Object.entries(dadosCnh)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        
        // Usa as funções do layout para exibir o resultado e adicionar ao histórico
        renderResult(resultBoxId, resultString, true);
        addToHistory('CNH', dadosCnh, true);

        // Mostra o botão "Adicionar ao Cenário"
        addToScenarioBtn.style.display = 'block';
    });

    addToScenarioBtn.addEventListener('click', () => {
        addToScenario('cnh');
    });
});