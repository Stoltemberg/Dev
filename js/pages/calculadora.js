import { PercentageCalculator } from '../tools/calculadora-logica.js';

document.addEventListener('DOMContentLoaded', () => {
    // Cenário 1: X% de Y
    const p1_percent = document.getElementById('p1-percent');
    const p1_total = document.getElementById('p1-total');
    const p1_result = document.getElementById('p1-result');
    
    function updateCalc1() {
        const result = PercentageCalculator.calculatePercentageOf(p1_percent.value, p1_total.value);
        p1_result.textContent = result !== '' ? result.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) : '?';
    }
    p1_percent.addEventListener('input', updateCalc1);
    p1_total.addEventListener('input', updateCalc1);

    // Cenário 2: X é qual % de Y
    const p2_partial = document.getElementById('p2-partial');
    const p2_total = document.getElementById('p2-total');
    const p2_result = document.getElementById('p2-result');

    function updateCalc2() {
        const result = PercentageCalculator.calculateWhatPercent(p2_partial.value, p2_total.value);
        p2_result.textContent = result !== '' ? result.toFixed(2) + '%' : '?';
    }
    p2_partial.addEventListener('input', updateCalc2);
    p2_total.addEventListener('input', updateCalc2);

    // Cenário 3: Variação %
    const p3_old = document.getElementById('p3-old');
    const p3_new = document.getElementById('p3-new');
    const p3_result = document.getElementById('p3-result');

    function updateCalc3() {
        const result = PercentageCalculator.calculatePercentChange(p3_old.value, p3_new.value);
        if (result !== '') {
            const prefix = result >= 0 ? '↑' : '↓';
            p3_result.textContent = `${prefix} ${Math.abs(result).toFixed(2)}%`;
            p3_result.style.color = result >= 0 ? '#27ae60' : 'var(--danger-color)';
        } else {
            p3_result.textContent = '?';
            p3_result.style.color = 'var(--primary-color)';
        }
    }
    p3_old.addEventListener('input', updateCalc3);
    p3_new.addEventListener('input', updateCalc3);
});