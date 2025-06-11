export const CodeFormatter = {
    // A função agora é assíncrona para lidar com o Prettier
    format: async function(code, language) {
        if (!code.trim()) {
            return { formattedCode: '' }; // Retorna vazio se não houver código
        }

        try {
            // Se a linguagem for SQL, usa a biblioteca sqlFormatter
            if (language === 'sql') {
                // Acessa o objeto global sqlFormatter carregado via CDN
                const formattedCode = sqlFormatter.format(code, { language: 'sql', tabWidth: 2 });
                return { formattedCode };
            } 
            
            // Para todas as outras linguagens, usa a biblioteca Prettier
            else {
                // Mapeia o valor do select para o parser correto do Prettier
                const parserMap = {
                    'javascript': 'babel',
                    'json': 'json',
                    'html': 'html',
                    'css': 'css',
                    'java': 'java'
                };
                const parser = parserMap[language];

                // Acessa os objetos globais prettier e prettierPlugins carregados via CDN
                const formattedCode = await prettier.format(code, {
                    parser: parser,
                    plugins: prettierPlugins,
                    tabWidth: 2,
                    printWidth: 80,
                });
                return { formattedCode };
            }
        } catch (e) {
            // Retorna uma mensagem de erro clara se a formatação falhar
            return { error: `Erro ao formatar ${language.toUpperCase()}:\n${e.message}` };
        }
    }
};