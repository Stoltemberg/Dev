const RegexTester = {
    test: function(pattern, flags, testString) {
        if (!pattern) {
            return {
                highlightedHtml: this.escapeHtml(testString),
                matchCount: 0,
                matches: []
            };
        }
        
        try {
            const regex = new RegExp(pattern, flags);
            const matches = [...testString.matchAll(regex)];
            
            let highlightedHtml = this.escapeHtml(testString);
            if (matches.length > 0) {
                // Para destacar, iteramos de trás para frente para não bagunçar os índices
                for (let i = matches.length - 1; i >= 0; i--) {
                    const match = matches[i];
                    const startIndex = match.index;
                    const endIndex = startIndex + match[0].length;
                    
                    highlightedHtml = 
                        highlightedHtml.substring(0, startIndex) +
                        `<span class="regex-match">${this.escapeHtml(match[0])}</span>` +
                        highlightedHtml.substring(endIndex);
                }
            }
            
            return {
                highlightedHtml,
                matchCount: matches.length,
                matches: matches.map(m => m[0])
            };
        } catch (e) {
            return { error: `Erro na Expressão Regular: ${e.message}` };
        }
    },
    
    escapeHtml: function(str) {
        return str.replace(/[&<>"']/g, function(m) {
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
            return map[m];
        });
    }
};