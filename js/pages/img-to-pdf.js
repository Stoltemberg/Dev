import { ImageToPdf } from '../tools/image_to_pdf.js';
import { showSpinner, hideSpinner, addToHistory } from '../shared/workspace-logic.js';

export function initImgToPdfPage() {
    const fileInput = document.getElementById('image-files-input');
    const previewArea = document.getElementById('file-preview-area');
    const convertBtn = document.getElementById('convert-pdf-btn');
    const progressDisplay = document.getElementById('conversion-progress');
    
    let selectedFiles = [];

    function updateFilePreview() {
        if (selectedFiles.length === 0) {
            previewArea.innerHTML = '<p class="empty-state">Aguardando arquivos...</p>';
            convertBtn.disabled = true;
            return;
        }

        previewArea.innerHTML = '';
        selectedFiles.forEach(file => {
            const card = document.createElement('div');
            card.className = 'file-preview-card';
            const thumb = document.createElement('img');
            thumb.src = URL.createObjectURL(file);
            thumb.onload = () => URL.revokeObjectURL(thumb.src); // Libera memória
            
            const name = document.createElement('span');
            name.className = 'file-name';
            name.textContent = file.name;
            
            card.appendChild(thumb);
            card.appendChild(name);
            previewArea.appendChild(card);
        });
        convertBtn.disabled = false;
    }

    fileInput.addEventListener('change', (e) => {
        selectedFiles = Array.from(e.target.files);
        updateFilePreview();
    });

    convertBtn.addEventListener('click', async () => {
        if (selectedFiles.length === 0) {
            alert('Por favor, selecione as imagens primeiro.');
            return;
        }

        showSpinner(convertBtn);
        progressDisplay.textContent = 'Iniciando conversão...';

        try {
            const options = {
                files: selectedFiles,
                pageSize: document.getElementById('pdf-page-size').value,
                orientation: document.querySelector('input[name="pdf-orientation"]:checked').value,
                imageFit: document.querySelector('input[name="pdf-image-fit"]:checked').value,
                onProgress: (current, total, message) => {
                    progressDisplay.textContent = message;
                }
            };

            const pdf = await ImageToPdf.generate(options);
            
            const filename = document.getElementById('pdf-filename').value || 'documento';
            pdf.save(`${filename}.pdf`);
            
            addToHistory('PDF Gerado', `${selectedFiles.length} imagens convertidas para ${filename}.pdf`, false);

        } catch (error) {
            progressDisplay.textContent = `Erro: ${error.message}`;
            alert(`Ocorreu um erro durante a conversão: ${error.message}`);
        } finally {
            hideSpinner(convertBtn);
        }
    });
}