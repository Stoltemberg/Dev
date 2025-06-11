import { VideoInfo } from '../tools/video_info.js';
import { addToHistory } from '../shared/workspace-logic.js';

export function initVideoInfoPage() {
    const fileInput = document.getElementById('video-file-input');
    const analysisSection = document.getElementById('video-analysis-section');
    const videoPreview = document.getElementById('video-preview');
    const metadataOutput = document.getElementById('metadata-output');
    const captureSection = document.getElementById('capture-section');
    const captureBtn = document.getElementById('capture-frame-btn');
    const thumbPreview = document.getElementById('thumbnail-preview');
    const thumbDownloadLink = document.getElementById('download-thumb-link');

    let currentVideoElement = null;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Limpa a área anterior
        videoPreview.innerHTML = '';
        metadataOutput.innerHTML = '<p class="empty-state">Analisando...</p>';
        thumbPreview.style.display = 'none';

        // Cria o elemento de vídeo e a URL do objeto
        const videoURL = URL.createObjectURL(file);
        currentVideoElement = document.createElement('video');
        currentVideoElement.controls = true;
        currentVideoElement.src = videoURL;
        
        // Adiciona listener para quando os metadados estiverem prontos
        currentVideoElement.onloadedmetadata = () => {
            const info = VideoInfo.getInfo(file, currentVideoElement);
            metadataOutput.innerHTML = ''; // Limpa "Analisando..."
            
            Object.entries(info).forEach(([key, value]) => {
                const item = document.createElement('div');
                item.className = 'metadata-item';
                item.innerHTML = `
                    <div class="stat-label">${key}</div>
                    <div class="stat-value">${value}</div>
                `;
                metadataOutput.appendChild(item);
            });

            captureSection.style.display = 'block';
            addToHistory('Vídeo Analisado', file.name, false);
        };

        videoPreview.appendChild(currentVideoElement);
        analysisSection.style.display = 'grid';
    });
    
    captureBtn.addEventListener('click', () => {
        if (!currentVideoElement) return;

        const imageDataUrl = VideoInfo.captureFrame(currentVideoElement);
        thumbPreview.src = imageDataUrl;
        thumbPreview.style.display = 'block';

        // Prepara o link de download
        thumbDownloadLink.href = imageDataUrl;
        thumbDownloadLink.download = `thumbnail-${Date.now()}.png`;
        // Simula um clique para baixar imediatamente
        thumbDownloadLink.click();
    });
}