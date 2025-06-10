const Base64 = {
    encode: (text) => {
        try {
            return btoa(unescape(encodeURIComponent(text)));
        } catch (e) {
            return "Entrada inválida para codificação.";
        }
    },
    decode: (text) => {
        try {
            return decodeURIComponent(escape(atob(text)));
        } catch (e) {
            return "String Base64 inválida ou corrompida.";
        }
    }
};