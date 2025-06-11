export const HashGenerator = {
    // Gera todos os hashes para uma entrada de texto
    generateFromText: function(text) {
        if (text === '') return null;
        try {
            return {
                MD5: CryptoJS.MD5(text).toString(),
                SHA1: CryptoJS.SHA1(text).toString(),
                SHA256: CryptoJS.SHA256(text).toString(),
                SHA512: CryptoJS.SHA512(text).toString(CryptoJS.enc.Hex)
            };
        } catch (e) {
            console.error("Erro ao gerar hash de texto:", e);
            return { error: "Não foi possível gerar os hashes." };
        }
    },

    // Função assíncrona para gerar hashes de um arquivo local
    generateFromFile: function(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                return reject(new Error("Nenhum arquivo selecionado."));
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const fileData = event.target.result;
                    const wordArray = CryptoJS.lib.WordArray.create(fileData);
                    const hashes = {
                        MD5: CryptoJS.MD5(wordArray).toString(),
                        SHA1: CryptoJS.SHA1(wordArray).toString(),
                        SHA256: CryptoJS.SHA256(wordArray).toString(),
                        SHA512: CryptoJS.SHA512(wordArray).toString(CryptoJS.enc.Hex)
                    };
                    resolve(hashes);
                } catch (e) {
                    reject(new Error("Erro ao processar o arquivo."));
                }
            };
            reader.onerror = () => { reject(new Error("Não foi possível ler o arquivo.")); };
            reader.readAsArrayBuffer(file);
        });
    }
};