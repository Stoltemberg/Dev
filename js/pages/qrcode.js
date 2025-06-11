import { QrCodeGenerator } from '../tools/qrcode.js';
import { addToHistory } from '../shared/workspace-logic.js';

export function initQrcodePage() {
    const textInput = document.getElementById('qrcode-texto');
    const sizeSelect = document.getElementById('qrcode-size');
    const errorLevelSelect = document.getElementById('qrcode-error-level');
    const resultBox = document.getElementById('resultado-qrcode');
    const downloadBtn = document.getElementById('qrcode-download-btn');

    let lastDataUrl = '';
    let debounceTimer;

    function generateQrCode() {
        const options = {
            text: textInput.value,
            size: parseInt(sizeSelect.value, 10),
            errorCorrectionLevel: errorLevelSelect.value
        };

        const result = QrCodeGenerator.generate(options);

        if (result.error) {
            resultBox.innerHTML = `<span>${result.error}</span>`;
            resultBox.classList.remove('has-content');
            downloadBtn.style.display = 'none';
        } else {
            resultBox.innerHTML = result.imageHtml;
            resultBox.classList.add('has-content');
            lastDataUrl = result.dataUrl;
            downloadBtn.style.display = 'block';
            addToHistory('QR Code', options.text, false);
        }
    }

    function handleInput() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            generateQrCode();
        }, 300); // Espera 300ms após o usuário parar de digitar
    }

    textInput.addEventListener('input', handleInput);
    sizeSelect.addEventListener('change', generateQrCode);
    errorLevelSelect.addEventListener('change', generateQrCode);

    downloadBtn.addEventListener('click', () => {
        if (lastDataUrl) {
            const a = document.createElement('a');
            a.href = lastDataUrl;
            a.download = 'qrcode.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });

    // Gera o QR Code inicial se houver texto
    if (textInput.value) {
        generateQrCode();
    }
}