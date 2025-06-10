document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DO TEMA ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
            themeSwitcher.innerHTML = '🌙';
        } else {
            body.classList.remove('light-mode');
            themeSwitcher.innerHTML = '☀️';
        }
    };

    const currentTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(currentTheme);

    themeSwitcher.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // --- FUNÇÕES AUXILIARES ---
    const copyToClipboard = (str, button) => {
        navigator.clipboard.writeText(str).then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = '✅';
            button.classList.add('copied');
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('copied');
            }, 1500);
        });
    };
    
    const renderResult = (elementId, content, isPreformatted = false) => {
        const resultBox = document.getElementById(elementId);
        resultBox.innerHTML = '';
        const textElement = document.createElement(isPreformatted ? 'pre' : 'span');
        textElement.textContent = content;
        
        const hasContent = content && !content.toLowerCase().includes("clique em") && !content.toLowerCase().includes("aguardando");

        if (hasContent) {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.innerHTML = '📋';
            copyButton.onclick = () => copyToClipboard(content, copyButton);
            resultBox.appendChild(copyButton);
        }
        
        resultBox.appendChild(textElement);
    };

    // --- LÓGICA DAS ABAS ---
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));
            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.tab);
            target.classList.add('active');
        });
    });

    // --- EVENT LISTENERS DE TODAS AS 12 FERRAMENTAS ---

    // 1. Gerador de CPF
    document.getElementById('gerar-cpf').addEventListener('click', () => {
        const comPontos = document.getElementById('cpf-pontuacao').checked;
        renderResult('resultado-cpf', Cpf.generate(comPontos));
    });

    // 2. Gerador de CNPJ (ATUALIZADO)
    document.getElementById('gerar-cnpj').addEventListener('click', () => {
        const comPontos = document.getElementById('cnpj-pontuacao').checked;
        const dadosEmpresa = Cnpj.generate(comPontos);
        const resultadoFormatado = Object.entries(dadosEmpresa)
            .map(([chave, valor]) => `${chave}: ${valor}`)
            .join('\n');
        renderResult('resultado-cnpj', resultadoFormatado, true);
    });
    
    // 3. Gerador de Pessoa
    const idadeCheckbox = document.getElementById('pessoa-idade-especifica-check');
    const idadeInput = document.getElementById('pessoa-idade');
    idadeCheckbox.addEventListener('change', () => { idadeInput.disabled = !idadeCheckbox.checked; });
    document.getElementById('gerar-pessoa').addEventListener('click', () => {
        let idade;
        if (idadeCheckbox.checked) {
            idade = parseInt(idadeInput.value, 10) || 25;
        } else {
            idade = Math.floor(Math.random() * (60 - 18 + 1)) + 18;
        }
        const pessoaGerada = Pessoa.generate(idade);
        const resultadoFormatado = Object.entries(pessoaGerada).map(([k, v]) => `${k}: ${v}`).join('\n');
        renderResult('resultado-pessoa', resultadoFormatado, true);
    });
    
    // 4. Gerador de Senha
    document.getElementById('gerar-senha').addEventListener('click', () => {
        const length = document.getElementById('senha-tamanho').value;
        const useMaiusculas = document.getElementById('senha-maiusculas').checked;
        const useMinusculas = document.getElementById('senha-minusculas').checked;
        const useNumeros = document.getElementById('senha-numeros').checked;
        const useSimbolos = document.getElementById('senha-simbolos').checked;
        renderResult('resultado-senha', Senha.generate(length, useMaiusculas, useMinusculas, useNumeros, useSimbolos));
    });

    // 5. Gerador de UUID
    document.getElementById('gerar-uuid').addEventListener('click', () => {
        renderResult('resultado-uuid', Uuid.generate());
    });

    // 6. Gerador de Cartão de Crédito
    document.getElementById('gerar-cartao').addEventListener('click', () => {
        const bandeira = document.getElementById('cartao-bandeira').value;
        const dadosCartao = Cartao.generate(bandeira);
        const resultadoFormatado = 
`Número: ${dadosCartao.numero}
Nome do Titular: ${dadosCartao.nome}
Validade: ${dadosCartao.validade}
CVV: ${dadosCartao.cvv}`;
        renderResult('resultado-cartao', resultadoFormatado, true);
    });

    // 7. Gerador de Lorem Ipsum
    document.getElementById('gerar-lorem').addEventListener('click', () => {
        const count = document.getElementById('lorem-paragrafos').value;
        renderResult('resultado-lorem', Lorem.generate(count), true);
    });
    
    // 8. Gerador de QR Code
    document.getElementById('gerar-qrcode').addEventListener('click', () => {
        const text = document.getElementById('qrcode-texto').value;
        QrCodeGenerator.generate(text, 'resultado-qrcode');
    });

    // 9. Base64
    document.getElementById('base64-codificar').addEventListener('click', () => {
        const input = document.getElementById('base64-input').value;
        renderResult('resultado-base64', Base64.encode(input), true);
    });
    document.getElementById('base64-decodificar').addEventListener('click', () => {
        const input = document.getElementById('base64-input').value;
        renderResult('resultado-base64', Base64.decode(input), true);
    });
    
    // 10. Contador de Caracteres
    const contadorInput = document.getElementById('contador-input');
    const resultadoContador = document.querySelector('#resultado-contador span');
    contadorInput.addEventListener('input', () => {
        const stats = Contador.count(contadorInput.value);
        resultadoContador.textContent = `Caracteres: ${stats.caracteres} | Palavras: ${stats.palavras} | Linhas: ${stats.linhas}`;
    });

    // 11. Conversor de Imagem para PDF
    document.getElementById('convert-pdf').addEventListener('click', () => {
        const fileInput = document.getElementById('image-input');
        if (fileInput.files.length > 0) {
            ImageToPdf.convert(fileInput.files[0], 'resultado-pdf');
        } else {
            document.getElementById('resultado-pdf').innerHTML = '<span>Por favor, selecione um arquivo primeiro.</span>';
        }
    });

    // 12. Analisador de Vídeo
    document.getElementById('analyze-video').addEventListener('click', () => {
        const fileInput = document.getElementById('video-input');
        if (fileInput.files.length > 0) {
            VideoInfo.analyze(fileInput.files[0], 'resultado-video-info');
        } else {
            document.getElementById('resultado-video-info').innerHTML = '<span>Por favor, selecione um arquivo primeiro.</span>';
        }
    });
});