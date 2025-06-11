const HashGenerator = {
    generate: function(text, algorithm) {
        if (text === '') {
            return 'A entrada de texto está vazia.';
        }
        try {
            // A biblioteca CryptoJS será importada via CDN no index.html
            switch (algorithm.toLowerCase()) {
                case 'md5':
                    return CryptoJS.MD5(text).toString();
                case 'sha1':
                    return CryptoJS.SHA1(text).toString();
                case 'sha256':
                    return CryptoJS.SHA256(text).toString();
                case 'sha512':
                    return CryptoJS.SHA512(text).toString();
                default:
                    return 'Algoritmo desconhecido.';
            }
        } catch (e) {
            return `Erro ao gerar hash: ${e.message}`;
        }
    }
};