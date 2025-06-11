const UrlEncoder = {
    encode: function(str) {
        try {
            return encodeURIComponent(str);
        } catch (e) {
            return `Erro ao codificar: ${e.message}`;
        }
    },
    decode: function(str) {
        try {
            return decodeURIComponent(str);
        } catch (e) {
            return `Erro ao decodificar. A string de entrada pode estar mal formatada.`;
        }
    }
};