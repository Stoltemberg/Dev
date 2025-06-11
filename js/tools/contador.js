export const Contador = {
    count: function(text) {
        const caracteres = text.length;
        const palavras = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const linhas = text.split('\n').length;
        
        // Novas Métricas
        const sentencas = text.match(/[^\.!\?]+[\.!\?]+/g)?.length || 0;
        const paragrafos = text.split(/\n\s*\n/).filter(p => p.trim() !== '').length || (text.trim() ? 1 : 0);
        const bytes = new Blob([text]).size;
        
        // Estimativas de Tempo (WPM = Words Per Minute)
        const wpmLeitura = 225;
        const wpmFala = 150;
        const tempoLeitura = Math.ceil(palavras / wpmLeitura);
        const tempoFala = Math.ceil(palavras / wpmFala);
        
        return {
            Caracteres: caracteres.toLocaleString('pt-BR'),
            Palavras: palavras.toLocaleString('pt-BR'),
            Linhas: linhas.toLocaleString('pt-BR'),
            Sentenças: sentencas.toLocaleString('pt-BR'),
            Parágrafos: paragrafos.toLocaleString('pt-BR'),
            'Tamanho (Bytes)': bytes.toLocaleString('pt-BR'),
            'Tempo de Leitura': `~ ${tempoLeitura} min`,
            'Tempo de Fala': `~ ${tempoFala} min`
        };
    }
};