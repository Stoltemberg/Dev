import { renderResult, addToHistory } from '../shared/workspace-logic.js';
import { UrlEncoder } from '../tools/url_encoder.js';

export function initUrlEncoderPage() {
    const inputArea = document.getElementById('url-encoder-input');
    const encodeBtn = document.getElementById('url-encode-btn');
    const decodeBtn = document.getElementById('url-decode-btn');
    const resultBoxId = 'resultado-url-encoder';

    encodeBtn.addEventListener('click', () => {
        const originalText = inputArea.value;
        const encodedText = UrlEncoder.encode(originalText);
        renderResult(resultBoxId, encodedText, true);
        addToHistory('URL (Codificado)', originalText, false);
    });

    decodeBtn.addEventListener('click', () => {
        const encodedText = inputArea.value;
        const decodedText = UrlEncoder.decode(encodedText);
        renderResult(resultBoxId, decodedText, true);
        addToHistory('URL (Decodificado)', encodedText, false);
    });
}