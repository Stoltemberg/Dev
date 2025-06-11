export const PercentageCalculator = {
    // Cenário 1: Calcula X% de Y (Ex: 20% de 150 = 30)
    calculatePercentageOf(percent, total) {
        const p = parseFloat(percent);
        const t = parseFloat(total);
        if (isNaN(p) || isNaN(t)) return '';
        return (t * (p / 100));
    },

    // Cenário 2: X é qual porcentagem de Y? (Ex: 30 de 150 = 20%)
    calculateWhatPercent(partial, total) {
        const p = parseFloat(partial);
        const t = parseFloat(total);
        if (isNaN(p) || isNaN(t) || t === 0) return '';
        return (p / t) * 100;
    },

    // Cenário 3: Variação percentual de X para Y (Ex: de 150 para 180 = 20% de aumento)
    calculatePercentChange(oldValue, newValue) {
        const oldV = parseFloat(oldValue);
        const newV = parseFloat(newValue);
        if (isNaN(oldV) || isNaN(newV) || oldV === 0) return '';
        return ((newV - oldV) / oldV) * 100;
    }
};