const ImageToPdf = {
    convert: (file, resultContainerId) => {
        const resultContainer = document.getElementById(resultContainerId);
        resultContainer.innerHTML = '<span>Processando imagem...</span>';
        if (!file || !file.type.startsWith('image/')) {
            resultContainer.innerHTML = '<span>Por favor, selecione um arquivo de imagem válido.</span>';
            return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                try {
                    const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();
                    const imgWidth = img.width;
                    const imgHeight = img.height;
                    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
                    const finalWidth = imgWidth * ratio;
                    const finalHeight = imgHeight * ratio;
                    const x = (pageWidth - finalWidth) / 2;
                    const y = (pageHeight - finalHeight) / 2;
                    pdf.addImage(img, 'JPEG', x, y, finalWidth, finalHeight);
                    pdf.save('convertido.pdf');
                    resultContainer.innerHTML = '<span>PDF gerado com sucesso! O download deve iniciar em breve.</span>';
                } catch(e) {
                     resultContainer.innerHTML = `<span>Ocorreu um erro: ${e.message}</span>`;
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
};