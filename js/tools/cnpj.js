const Cnpj = {
    rand: (min = 0, max = 9) => Math.floor(Math.random() * (max - min + 1)) + min,
    geraDigito: (n) => {
        let i = n.length - 7;
        const resto = n.reduce((total, el) => {
            const res = total + el * i--;
            if (i < 2) i = 9;
            return res;
        }, 0) % 11;
        return resto < 2 ? 0 : 11 - resto;
    },
    format: (cnpj) => cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'),
    generate: (comPontos = true) => {
        const n = Array.from({ length: 8 }, () => Cnpj.rand());
        n.push(0, 0, 0, 1);
        n.push(Cnpj.geraDigito([...n]));
        n.push(Cnpj.geraDigito([...n]));
        const cnpjString = n.join('');
        return comPontos ? Cnpj.format(cnpjString) : cnpjString;
    }
};