import { renderResult, addToHistory } from '../shared/workspace-logic.js';
import { Cpf } from '../tools/cpf.js';

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos da página
    const gerarBtn = document.getElementById('gerar-cpf');
    const quantidadeInput = document.getElementById('cpf-quantidade');
    const pontuacaoCheckbox = document.getElementById('cpf-pontuacao');
    const resultBoxId = 'resultado-cpf';

    // Lógica para atualizar o texto do botão dinamicamente
    function updateButtonText() {
        const quantidade = parseInt(quantidadeInput.value, 10) || 1;
        if (quantidade > 1) {
            gerarBtn.textContent = `Gerar ${quantidade} CPFs`;
        } else {
            gerarBtn.textContent = 'Gerar 1 CPF';
        }
    }

    // Adiciona o listener para atualizar o botão
    quantidadeInput.addEventListener('input', updateButtonText);
    
    // Listener principal do botão "Gerar"
    gerarBtn.addEventListener('click', () => {
        const quantidade = parseInt(quantidadeInput.value, 10) || 1;
        const comPontos = pontuacaoCheckbox.checked;

        if (quantidade === 1) {
            // Lógica para gerar um único CPF
            const cpf = Cpf.generate(comPontos);
            renderResult(resultBoxId, cpf, true);
            addToHistory('CPF', cpf, false);
        } else {
            // Lógica para gerar múltiplos CPFs
            const cpfs = Array.from({ length: quantidade }, () => Cpf.generate(comPontos));
            const resultString = cpfs.join('\n');
            renderResult(resultBoxId, resultString, true);
            addToHistory(`${quantidade} CPFs Gerados`, resultString, false);
        }
    });

    // Inicia o texto do botão corretamente
    updateButtonText();
});