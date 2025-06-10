const Contador = {
    count: (text) => {
        const caracteres = text.length;
        const palavras = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const linhas = text.split('\n').length;
        return { caracteres, palavras, linhas };
    }
};