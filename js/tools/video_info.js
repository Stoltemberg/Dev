export const VideoInfo = {
    // Função auxiliar para calcular o Máximo Divisor Comum para a proporção
    gcd: function(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    },

    // Extrai os metadados do arquivo e do elemento de vídeo
    getInfo: function(file, videoElement) {
        if (!file || !videoElement) return null;

        const { name, size, type } = file;
        const { videoWidth, videoHeight, duration } = videoElement;

        const commonDenominator = this.gcd(videoWidth, videoHeight);
        const aspectRatio = `${videoWidth / commonDenominator}:${videoHeight / commonDenominator}`;

        const minutes = Math.floor(duration / 60);
        const seconds = (duration % 60).toFixed(2);
        
        return {
            'Nome do Arquivo': name,
            'Tipo MIME': type,
            'Tamanho': `${(size / 1024 / 1024).toFixed(2)} MB`,
            'Resolução': `${videoWidth} x ${videoHeight} px`,
            'Duração': `${minutes}m ${seconds}s`,
            'Proporção da Tela': aspectRatio,
            'Total de Frames (est. 30fps)': Math.round(duration * 30).toLocaleString('pt-BR'),
            'Total de Frames (est. 60fps)': Math.round(duration * 60).toLocaleString('pt-BR')
        };
    },

    // Captura o frame atual do vídeo e retorna como um Data URL
    captureFrame: function(videoElement) {
        if (!videoElement) return null;

        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        return canvas.toDataURL('image/png');
    }
};