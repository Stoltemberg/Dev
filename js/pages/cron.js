import { renderResult, addToHistory } from '../shared/workspace-logic.js';
import { CronParser } from '../tools/cron_parser.js';

export function initCronPage() {
    const cronInput = document.getElementById('cron-input');
    const descResultBox = document.getElementById('resultado-cron-desc');
    const nextResultBox = document.getElementById('resultado-cron-next');

    // Função para rodar a análise
    function runCronParser() {
        const expression = cronInput.value;
        
        const parsed = CronParser.parse(expression);
        
        if (parsed.error) {
            descResultBox.innerHTML = `<span class="cron-error">${parsed.error}</span>`;
            nextResultBox.innerHTML = '<span>Inválido</span>';
            descResultBox.classList.add('has-content');
            nextResultBox.classList.remove('has-content');
        } else {
            // Usa renderResult para o box de descrição
            renderResult('resultado-cron-desc', parsed.description, false);
            
            const nextExecutions = CronParser.getNextExecutions(expression);
            if (nextExecutions.length > 0) {
                const nextDatesString = "Próximas 5 execuções:\n" + nextExecutions.map(date => date.toLocaleString('pt-BR')).join('\n');
                renderResult('resultado-cron-next', nextDatesString, true);
            } else {
                renderResult('resultado-cron-next', "Não foi possível calcular as próximas execuções.");
            }
            
            if (expression.trim().split(/\s+/).length === 5) {
                addToHistory('Expressão Cron', expression, false);
            }
        }
    }

    if (cronInput) {
        cronInput.addEventListener('input', runCronParser);
        // Executa na carga inicial para analisar o valor padrão
        runCronParser();
    }
}