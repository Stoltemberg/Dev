export const QrCodeGenerator = {
    // A função principal agora aceita um objeto de opções
    generate: function(options = {}) {
        const {
            text = '',
            size = 4, // um inteiro de 1 a 10
            errorCorrectionLevel = 'L' // 'L', 'M', 'Q', 'H'
        } = options;

        if (!text.trim()) {
            return { error: 'O campo de texto está vazio.' };
        }

        try {
            // A biblioteca qrcode será importada via CDN no index.html
            const typeNumber = 0; // 0 para auto-detectar o tamanho necessário
            const qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData(text);
            qr.make();
            
            // O 'size' aqui é um multiplicador de pixels, não o tamanho final
            const imgTag = qr.createImgTag(size, 8); // (cell size, margin)
            
            // Para o download, precisamos do data URL da imagem
            const dataUrl = qr.createDataURL(size, 8);

            return {
                imageHtml: imgTag,
                dataUrl: dataUrl
            };
        } catch (e) {
            return { error: `Erro ao gerar QR Code. O texto pode ser muito longo. (${e.message})` };
        }
    }
};