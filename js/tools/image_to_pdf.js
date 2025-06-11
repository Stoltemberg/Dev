const ImageToPdf = {
    convert: (file, resultContainerId, onComplete) => {
        const resultContainer = document.getElementById(resultContainerId);
        resultContainer.innerHTML = '<span>Processando imagem...</span>';
        if (!file || !file.type.startsWith('image/')) {
            resultContainer.innerHTML = '<span>Por favor, selecione um arquivo de imagem válido.</span>';
            if (onComplete) onComplete();
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
                    const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
                    const x = (pageWidth - img.width * ratio) / 2;
                    const y = (pageHeight - img.height * ratio) / 2;
                    pdf.addImage(img, 'JPEG', x, y, img.width * ratio, img.height * ratio);
                    pdf.save('convertido.pdf');
                    resultContainer.innerHTML = '<span>PDF gerado com sucesso!</span>';
                } catch (e) {
                     resultContainer.innerHTML = `<span>Ocorreu um erro: ${e.message}</span>`;
                } finally {
                    if (onComplete) onComplete();
                }
            };
            img.onerror = () => { resultContainer.innerHTML = '<span>Erro ao carregar a imagem.</span>'; if (onComplete) onComplete(); };
            img.src = event.target.result;
        };
        reader.onerror = () => { resultContainer.innerHTML = '<span>Erro ao ler o arquivo.</span>'; if (onComplete) onComplete(); };
        reader.readAsDataURL(file);
    }
};