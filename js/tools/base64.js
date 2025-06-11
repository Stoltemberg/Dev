export const Base64 = {
    encode: function(text) {
        try {
            // Trata corretamente caracteres UTF-8
            return btoa(unescape(encodeURIComponent(text)));
        } catch (e) {
            return "Entrada inválida para codificação.";
        }
    },
    decode: function(text) {
        try {
            // Trata corretamente caracteres UTF-8
            return decodeURIComponent(escape(atob(text)));
        } catch (e) {
            return "String Base64 inválida ou corrompida.";
        }
    }
};