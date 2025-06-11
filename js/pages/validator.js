import { Validators } from '../tools/validators.js';
// Não precisamos mais importar addToHistory aqui, pois a validação é local

export function initValidatorPage() {
    console.log('[validator.js] Função initValidatorPage() foi chamada.');

    const validatorInput = document.getElementById('validator-input');
    const validatorType = document.getElementById('validator-type-select');
    const resultBox = document.getElementById('resultado-validator');

    if (!validatorInput || !validatorType || !resultBox) {
        console.error('[validator.js] ERRO: Um ou mais elementos essenciais (input, select, resultBox) não foram encontrados no HTML.');
        return;
    }

    const runValidator = () => {
        const type = validatorType.value;
        const value = validatorInput.value;
        console.log(`[validator.js] runValidator acionado. Tipo: ${type}, Valor: '${value}'`);

        if (!value.trim()) {
            resultBox.innerHTML = '<span>Aguardando um número para validar...</span>';
            resultBox.classList.remove('has-content');
            return;
        }
        
        let isValid = false;
        if (type === 'cpf') {
            isValid = Validators.validateCpf(value);
        } else if (type === 'cnpj') {
            isValid = Validators.validateCnpj(value);
        }
        
        console.log('[validator.js] Resultado da validação:', isValid);
        
        const message = isValid ? 'VÁLIDO' : 'INVÁLIDO';
        const className = isValid ? 'valid' : 'invalid';
        
        resultBox.innerHTML = `<span class="validation-result ${className}">${message}</span>`;
        resultBox.classList.add('has-content');
    };
    
    validatorInput.addEventListener('input', runValidator);
    validatorType.addEventListener('change', runValidator);

    console.log('[validator.js] Listeners de input e change adicionados com sucesso.');
}