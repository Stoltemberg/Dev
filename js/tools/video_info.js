const VideoInfo = {
    analyze: (file, resultContainerId, onComplete) => {
        const resultContainer = document.getElementById(resultContainerId);
        resultContainer.innerHTML = '<span>Analisando vídeo...</span>';
        if (!file || !file.type.startsWith('video/')) {
            resultContainer.innerHTML = '<span>Por favor, selecione um arquivo de vídeo válido.</span>';
            if (onComplete) onComplete();
            return;
        }
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function() {
            window.URL.revokeObjectURL(video.src);
            const duration = video.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            const info = { "Nome": file.name, "Tipo": file.type, "Tamanho": `${(file.size / 1024 / 1024).toFixed(2)} MB`, "Resolução": `${video.videoWidth} x ${video.videoHeight} px`, "Duração": `${minutes}m ${seconds}s` };
            const resultText = Object.entries(info).map(([k, v]) => `${k}: ${v}`).join('\n');
            resultContainer.innerHTML = `<pre>${resultText}</pre>`;
            if (onComplete) onComplete();
        };
        video.onerror = function() {
            resultContainer.innerHTML = '<span>Não foi possível ler os metadados deste vídeo.</span>';
            if (onComplete) onComplete();
        };
        video.src = URL.createObjectURL(file);
    }
};