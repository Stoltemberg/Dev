import { renderResult, addToHistory, addToScenario, lastGeneratedData } from '../shared/workspace-logic.js';
import { Cartao } from '../tools/cartao.js';

export function initCartaoPage() {
    const gerarBtn = document.getElementById('gerar-cartao');
    const bandeiraSelect = document.getElementById('cartao-bandeira');
    const resultBoxId = 'resultado-cartao';
    const addToScenarioBtn = document.getElementById('add-cartao-to-cenario');

    gerarBtn.addEventListener('click', () => {
        const bandeira = bandeiraSelect.value;
        const dadosCartao = Cartao.generate(bandeira);

        // Armazena o último dado gerado para ser usado pelo Workspace
        lastGeneratedData.cartao = dadosCartao;
        
        // Formata o objeto para exibição
        const resultString = 
`Número: ${dadosCartao.numero}
Nome do Titular: ${dadosCartao.nome}
Validade: ${dadosCartao.validade}
CVV: ${dadosCartao.cvv}`;

        // Usa as funções do layout para exibir o resultado e adicionar ao histórico
        renderResult(resultBoxId, resultString, true);
        addToHistory('Cartão de Crédito', dadosCartao, true);

        // Mostra o botão "Adicionar ao Cenário"
        addToScenarioBtn.style.display = 'block';
    });

    addToScenarioBtn.addEventListener('click', () => {
        addToScenario('cartao');
    });
}