import { renderResult, addToHistory, addToScenario, lastGeneratedData } from '../shared/workspace-logic.js';
import { Cnpj } from '../tools/cnpj.js';

document.addEventListener('DOMContentLoaded', () => {
    const gerarBtn = document.getElementById('gerar-cnpj');
    const pontuacaoCheckbox = document.getElementById('cnpj-pontuacao');
    const resultBoxId = 'resultado-cnpj';
    const addToScenarioBtn = document.getElementById('add-cnpj-to-cenario');

    gerarBtn.addEventListener('click', () => {
        const comPontos = pontuacaoCheckbox.checked;
        const dadosEmpresa = Cnpj.generate(comPontos);

        // Atualiza o último dado gerado para uso no cenário
        lastGeneratedData.cnpj = dadosEmpresa;
        
        // Formata o objeto para exibição
        const resultString = Object.entries(dadosEmpresa)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');

        renderResult(resultBoxId, resultString, true);
        addToHistory('CNPJ', dadosEmpresa, true); // true = este item pode ser adicionado a um cenário

        // Mostra o botão "Adicionar ao Cenário"
        addToScenarioBtn.style.display = 'block';
    });

    addToScenarioBtn.addEventListener('click', () => {
        addToScenario('cnpj');
    });
});