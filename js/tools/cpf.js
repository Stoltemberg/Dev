export const Cpf = {
    rand: (min = 0, max = 9) => Math.floor(Math.random() * (max - min + 1)) + min,

    geraDigito: (n) => {
        const resto = n.reduce((total, i, key) => total + i * (n.length + 1 - key), 0) % 11;
        return resto < 2 ? 0 : 11 - resto;
    },

    format: (cpf) => cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),

    generate: function(comPontos = true) {
        const n = Array.from({ length: 9 }, () => this.rand());
        n.push(this.geraDigito(n));
        n.push(this.geraDigito(n));
        const cpfString = n.join('');
        return comPontos ? this.format(cpfString) : cpfString;
    }
};