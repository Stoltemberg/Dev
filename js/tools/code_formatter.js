const CodeFormatter = {
    format: function(code, language) {
        if (!code.trim()) {
            return { error: "O campo de código está vazio." };
        }

        try {
            if (language === 'json') {
                const jsonObj = JSON.parse(code);
                return { formattedCode: JSON.stringify(jsonObj, null, 2) };
            }
            if (language === 'sql') {
                // A biblioteca sqlFormatter será importada via CDN no index.html
                return { formattedCode: sqlFormatter.format(code, { language: 'sql', tabWidth: 2 }) };
            }
            return { error: "Linguagem não suportada." };
        } catch (e) {
            return { error: `Erro ao formatar ${language.toUpperCase()}: ${e.message}` };
        }
    }
};