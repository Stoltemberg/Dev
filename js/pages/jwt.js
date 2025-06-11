import { JwtDebugger } from '../tools/jwt_debugger.js';
import { addToHistory } from '../shared/workspace-logic.js';

export function initJwtPage() {
    const jwtInput = document.getElementById('jwt-input');
    const resultBox = document.getElementById('resultado-jwt');

    function decodeAndRender() {
        const token = jwtInput.value.trim();

        if (!token) {
            resultBox.innerHTML = '<span>Aguardando um token...</span>';
            resultBox.classList.remove('has-content');
            return;
        }

        const result = JwtDebugger.decode(token);
        
        if (result.error) {
            resultBox.innerHTML = `<span class="jwt-error">${result.error}</span>`;
            resultBox.classList.add('has-content');
        } else {
            let html = `
                <div class="jwt-part">
                    <h4 class="jwt-part-title">Header (Cabeçalho)</h4>
                    <pre class="jwt-part-content">${JSON.stringify(result.header, null, 2)}</pre>
                </div>
                <div class="jwt-part">
                    <h4 class="jwt-part-title">Payload (Dados)</h4>
                    <pre class="jwt-part-content">${JSON.stringify(result.payload, null, 2)}</pre>
                </div>
            `;
            if (result.extra) {
                html += `
                    <div class="jwt-part">
                        <h4 class="jwt-part-title">Verificação de Validade</h4>
                        <pre class="jwt-part-content">Expira em: ${result.extra.expiracao}\nStatus: <span class="jwt-status ${result.extra.status.toLowerCase()}">${result.extra.status}</span></pre>
                    </div>
                `;
            }
            resultBox.innerHTML = html;
            resultBox.classList.add('has-content');
            addToHistory('JWT Decodificado', token.substring(0, 30) + '...', false);
        }
    }

    if (jwtInput) {
        jwtInput.addEventListener('input', decodeAndRender);
    }
}