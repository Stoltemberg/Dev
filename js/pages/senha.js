import { renderResult, addToHistory } from '../shared/workspace-logic.js';
import { Senha } from '../tools/senha.js';

export function initSenhaPage() {
    // Seleciona os elementos da página
    const gerarBtn = document.getElementById('gerar-senha');
    const saveOptionsBtn = document.getElementById('save-password-options');
    const lengthInput = document.getElementById('senha-tamanho');
    const uppercaseCheckbox = document.getElementById('senha-maiusculas');
    const lowercaseCheckbox = document.getElementById('senha-minusculas');
    const numbersCheckbox = document.getElementById('senha-numeros');
    const symbolsCheckbox = document.getElementById('senha-simbolos');
    const resultBoxId = 'resultado-senha';
    const storageKey = 'nextdevs_password_options';

    // --- Lógica para Salvar e Carregar Opções ---
    function savePasswordOptions() {
        const options = {
            length: lengthInput.value,
            useMaiusculas: uppercaseCheckbox.checked,
            useMinusculas: lowercaseCheckbox.checked,
            useNumeros: numbersCheckbox.checked,
            useSimbolos: symbolsCheckbox.checked,
        };
        localStorage.setItem(storageKey, JSON.stringify(options));
        
        saveOptionsBtn.textContent = 'Opções Salvas!';
        setTimeout(() => { saveOptionsBtn.textContent = 'Salvar Opções'; }, 2000);
    }

    function loadPasswordOptions() {
        const savedOptions = localStorage.getItem(storageKey);
        if (savedOptions) {
            const options = JSON.parse(savedOptions);
            lengthInput.value = options.length;
            uppercaseCheckbox.checked = options.useMaiusculas;
            lowercaseCheckbox.checked = options.useMinusculas;
            numbersCheckbox.checked = options.useNumeros;
            symbolsCheckbox.checked = options.useSimbolos;
        }
    }

    // --- Lógica de Geração ---
    function generate() {
        const password = Senha.generate(
            lengthInput.value,
            uppercaseCheckbox.checked,
            lowercaseCheckbox.checked,
            numbersCheckbox.checked,
            symbolsCheckbox.checked
        );
        
        renderResult(resultBoxId, password, true);
        addToHistory('Senha', password, false);
    }

    // Adiciona os event listeners
    gerarBtn.addEventListener('click', generate);
    saveOptionsBtn.addEventListener('click', savePasswordOptions);
    
    // Carrega as opções salvas ao iniciar a página
    loadPasswordOptions();
}