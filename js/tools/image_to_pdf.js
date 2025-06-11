export const ImageToPdf = {
    // Função assíncrona para lidar com múltiplas imagens e opções
    generate: async function(options = {}) {
        const {
            files = [],
            pageSize = 'a4',
            orientation = 'portrait',
            imageFit = 'contain',
            onProgress = () => {} // Callback para reportar o progresso
        } = options;

        if (files.length === 0) {
            return Promise.reject(new Error("Nenhum arquivo de imagem foi selecionado."));
        }

        // A biblioteca jsPDF é carregada via CDN
        const pdf = new jspdf.jsPDF(orientation, 'mm', pageSize);
        const totalFiles = files.length;

        for (let i = 0; i < totalFiles; i++) {
            const file = files[i];
            
            // Adiciona uma nova página a partir da segunda imagem
            if (i > 0) {
                pdf.addPage(pageSize, orientation);
            }

            // Atualiza o progresso
            onProgress(i, totalFiles, `Processando imagem ${i + 1}...`);

            // Usa uma Promise para carregar cada imagem
            await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const pageWidth = pdf.internal.pageSize.getWidth();
                        const pageHeight = pdf.internal.pageSize.getHeight();
                        const imgWidth = img.width;
                        const imgHeight = img.height;
                        
                        let finalWidth, finalHeight, x, y;

                        // Calcula as dimensões com base na opção de ajuste
                        if (imageFit === 'cover') { // Cobrir a página
                            const pageRatio = pageWidth / pageHeight;
                            const imgRatio = imgWidth / imgHeight;
                            if (pageRatio > imgRatio) {
                                finalWidth = pageWidth;
                                finalHeight = pageWidth / imgRatio;
                            } else {
                                finalHeight = pageHeight;
                                finalWidth = pageHeight * imgRatio;
                            }
                        } else { // Conter na página (padrão)
                            const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
                            finalWidth = imgWidth * ratio;
                            finalHeight = imgHeight * ratio;
                        }
                        
                        x = (pageWidth - finalWidth) / 2;
                        y = (pageHeight - finalHeight) / 2;

                        pdf.addImage(img, 'JPEG', x, y, finalWidth, finalHeight);
                        resolve();
                    };
                    img.onerror = reject;
                    img.src = event.target.result;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }
        
        onProgress(totalFiles, totalFiles, "PDF pronto para download!");
        return pdf;
    }
};