const QrCodeGenerator = {
    generate: (text, containerId) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        if (!text) {
            container.innerHTML = '<span>Digite um texto para gerar o QR Code.</span>';
            return;
        }
        try {
            const typeNumber = 0;
            const errorCorrectionLevel = 'L';
            const qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData(text);
            qr.make();
            container.innerHTML = qr.createImgTag(6, 12);
        } catch(e) {
            container.innerHTML = `<span>Erro ao gerar QR Code. Texto muito longo?</span>`;
        }
    }
};