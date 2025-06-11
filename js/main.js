document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // ESTADO GLOBAL E INICIALIZAÇÃO
    // =================================================================================
    let state = {
        currentScenario: {},
        history: [],
        savedScenarios: []
    };
    let lastGeneratedData = {};

    function initialize() {
        setupTheme();
        setupWorkspaceUI();
        setupTabs();
        setupEventListeners();
        loadState();
    }

    // =================================================================================
    // LÓGICA DE TEMA
    // =================================================================================
    function setupTheme() {
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
    }

    // =================================================================================
    // LÓGICA DO WORKSPACE E HISTÓRICO
    // =================================================================================
    function setupWorkspaceUI() {
        const workspace = document.getElementById('workspace');
        const openBtn = document.getElementById('workspace-toggle-btn');
        const closeBtn = document.getElementById('workspace-close-btn');
        openBtn.addEventListener('click', () => workspace.classList.add('open'));
        closeBtn.addEventListener('click', () => workspace.classList.remove('open'));

        document.querySelectorAll('.workspace-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.workspace-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.workspace-pane').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.target).classList.add('active');
            });
        });

        document.getElementById('clear-cenario-btn').addEventListener('click', () => {
            if (confirm("Tem certeza que deseja limpar o cenário atual?")) {
                state.currentScenario = {};
                saveState();
                renderAll();
            }
        });

        document.getElementById('save-cenario-btn').addEventListener('click', () => {
            if (Object.keys(state.currentScenario).length > 0) {
                const scenarioName = prompt("Digite um nome para este cenário:", "Cenário " + (state.savedScenarios.length + 1));
                if (scenarioName) {
                    state.savedScenarios.unshift({ name: scenarioName, data: { ...state.currentScenario } });
                    state.currentScenario = {};
                    saveState();
                    renderAll();
                }
            } else {
                alert("O cenário atual está vazio.");
            }
        });
    }

    function saveState() {
        localStorage.setItem('devtools_state', JSON.stringify(state));
    }

    function loadState() {
        const savedState = localStorage.getItem('devtools_state');
        if (savedState) {
            state = JSON.parse(savedState);
        }
        renderAll();
    }

    function renderAll() {
        renderCurrentScenario();
        renderHistory();
    }

    function renderCurrentScenario() {
        const container = document.getElementById('cenario-content');
        container.innerHTML = '';
        if (Object.keys(state.currentScenario).length === 0) {
            container.innerHTML = '<p class="empty-state">Gere dados e clique em "Adicionar ao Cenário" para começar.</p>';
            return;
        }
        for (const [key, data] of Object.entries(state.currentScenario)) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cenario-item';
            const title = key.charAt(0).toUpperCase() + key.slice(1);
            const content = typeof data === 'object' ? Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n') : data;
            itemDiv.innerHTML = `<h4>${title}</h4><pre>${content}</pre>`;
            container.appendChild(itemDiv);
        }
    }

    function renderHistory() {
        const container = document.getElementById('historico-content');
        container.innerHTML = '';
        if (state.history.length === 0 && state.savedScenarios.length === 0) {
            container.innerHTML = '<p class="empty-state">Seu histórico e cenários salvos aparecerão aqui.</p>';
            return;
        }

        if (state.savedScenarios.length > 0) {
            const savedTitle = document.createElement('h4');
            savedTitle.textContent = 'Cenários Salvos';
            container.appendChild(savedTitle);
            state.savedScenarios.forEach((scenario, index) => {
                const content = Object.entries(scenario.data).map(([k, v]) => (typeof v === 'object' ? `${k}:\n  ${Object.entries(v).map(([sk,sv])=>`${sk}: ${sv}`).join('\n  ')}` : `${k}: ${v}`)).join('\n');
                const itemDiv = document.createElement('div');
                itemDiv.className = 'historico-item';
                itemDiv.innerHTML = `<h4>${scenario.name} <button class="btn-danger" title="Excluir cenário" style="padding: 2px 8px; font-size: 0.8rem;" onclick="removeScenario(${index})">X</button></h4><pre>${content}</pre>`;
                container.appendChild(itemDiv);
            });
        }
        
         if (state.history.length > 0) {
            const historyTitle = document.createElement('h4');
            historyTitle.style.marginTop = '1.5rem';
            historyTitle.textContent = 'Últimos Itens Gerados';
            container.appendChild(historyTitle);
            state.history.forEach(item => {
                 const content = typeof item.data === 'object' ? Object.entries(item.data).map(([k,v])=>`${k}: ${v}`).join('\n') : item.data;
                 const itemDiv = document.createElement('div');
                 itemDiv.className = 'historico-item';
                 itemDiv.innerHTML = `<h4>${item.type}</h4><pre>${content}</pre>`;
                 container.appendChild(itemDiv);
            });
         }
    }
    
    function addToHistory(type, data) {
        state.history.unshift({ type, data, timestamp: new Date() });
        if (state.history.length > 15) state.history.pop();
        saveState();
        renderHistory();
    }
    
    window.removeScenario = function(index) {
        if (confirm(`Tem certeza que deseja excluir o cenário "${state.savedScenarios[index].name}"?`)) {
            state.savedScenarios.splice(index, 1);
            saveState();
            renderHistory();
        }
    }

    function addToScenario(type) {
        if(lastGeneratedData[type]) {
            let key = type;
            // Se já existe uma pessoa no cenário, tentamos associar o novo item a ela
            if(state.currentScenario.pessoa && (type === 'cnpj' || type === 'cnh' || type === 'cartao')) {
                 key = `${type} (${state.currentScenario.pessoa['Nome']})`;
            }
            state.currentScenario[key] = lastGeneratedData[type];
            saveState();
            renderCurrentScenario();
            workspace.classList.add('open');
            document.querySelector('.workspace-tab-btn[data-target="workspace-cenario"]').click();
        }
    }

    // =================================================================================
    // FUNÇÕES DE GERAÇÃO E EVENTOS
    // =================================================================================
    function copyToClipboard(str, button) {
        navigator.clipboard.writeText(str).then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = '✅';
            button.classList.add('copied');
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('copied');
            }, 1500);
        });
    }
    
    function renderResult(elementId, content, isPreformatted = false) {
        const resultBox = document.getElementById(elementId);
        resultBox.innerHTML = '';
        const textElement = document.createElement(isPreformatted ? 'pre' : 'span');
        textElement.textContent = content;
        const hasContent = content && !content.toLowerCase().includes("clique em") && !content.toLowerCase().includes("aguardando")  && !content.toLowerCase().includes("selecione um arquivo");
        if (hasContent) {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.innerHTML = '📋';
            copyButton.onclick = () => copyToClipboard(content, copyButton);
            resultBox.appendChild(copyButton);
        }
        resultBox.appendChild(textElement);
    }

    function setupTabs() {
        const tabs = document.querySelectorAll('.tab-button');
        const contents = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                tabs.forEach(item => item.classList.remove('active'));
                contents.forEach(content => content.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });
    }

    function handleSimpleGeneration(toolType, generatorFn, resultBoxId, isPreformatted = false) {
        const data = generatorFn();
        renderResult(resultBoxId, data, isPreformatted);
        addToHistory(toolType.charAt(0).toUpperCase() + toolType.slice(1), data);
    }
    
    function handleScenarioGeneration(toolType, generatorFn, resultBoxId) {
        const data = generatorFn();
        lastGeneratedData[toolType] = data;
        const content = typeof data === 'object' ? Object.entries(data).map(([k,v])=>`${k}: ${v}`).join('\n') : data;
        renderResult(resultBoxId, content, true);
        addToHistory(toolType.charAt(0).toUpperCase() + toolType.slice(1), data);
        const addButton = document.getElementById(`add-${toolType}-to-cenario`);
        if(addButton) addButton.style.display = 'block';
    }

    function setupEventListeners() {
        // Ferramentas que podem fazer parte de um cenário
        document.getElementById('gerar-pessoa').addEventListener('click', () => handleScenarioGeneration('pessoa', () => Pessoa.generate(document.getElementById('pessoa-idade-especifica-check').checked ? parseInt(document.getElementById('pessoa-idade').value, 10) || 25 : Math.floor(Math.random() * (60-18+1))+18), 'resultado-pessoa'));
        document.getElementById('gerar-cnpj').addEventListener('click', () => handleScenarioGeneration('cnpj', () => Cnpj.generate(document.getElementById('cnpj-pontuacao').checked), 'resultado-cnpj'));
        document.getElementById('gerar-cnh').addEventListener('click', () => handleScenarioGeneration('cnh', () => Cnh.generate(document.getElementById('cnh-formatacao').checked), 'resultado-cnh'));
        document.getElementById('gerar-cartao').addEventListener('click', () => handleScenarioGeneration('cartao', () => Cartao.generate(document.getElementById('cartao-bandeira').value), 'resultado-cartao'));

        document.getElementById('add-pessoa-to-cenario').addEventListener('click', () => addToScenario('pessoa'));
        document.getElementById('add-cnpj-to-cenario').addEventListener('click', () => addToScenario('cnpj'));
        document.getElementById('add-cnh-to-cenario').addEventListener('click', () => addToScenario('cnh'));
        document.getElementById('add-cartao-to-cenario').addEventListener('click', () => addToScenario('cartao'));

        // Ferramentas simples
        document.getElementById('gerar-cpf').addEventListener('click', () => handleSimpleGeneration('CPF', () => Cpf.generate(document.getElementById('cpf-pontuacao').checked), 'resultado-cpf'));
        document.getElementById('gerar-senha').addEventListener('click', () => handleSimpleGeneration('Senha', () => Senha.generate(document.getElementById('senha-tamanho').value, document.getElementById('senha-maiusculas').checked, document.getElementById('senha-minusculas').checked, document.getElementById('senha-numeros').checked, document.getElementById('senha-simbolos').checked), 'resultado-senha'));
        document.getElementById('gerar-uuid').addEventListener('click', () => handleSimpleGeneration('UUID', Uuid.generate, 'resultado-uuid'));
        document.getElementById('gerar-lorem').addEventListener('click', () => handleSimpleGeneration('Lorem Ipsum', () => Lorem.generate(document.getElementById('lorem-paragrafos').value), 'resultado-lorem', true));

        // Ferramentas interativas
        document.getElementById('gerar-qrcode').addEventListener('click', () => QrCodeGenerator.generate(document.getElementById('qrcode-texto').value, 'resultado-qrcode'));
        document.getElementById('base64-codificar').addEventListener('click', () => renderResult('resultado-base64', Base64.encode(document.getElementById('base64-input').value), true));
        document.getElementById('base64-decodificar').addEventListener('click', () => renderResult('resultado-base64', Base64.decode(document.getElementById('base64-input').value), true));
        
        const contadorInput = document.getElementById('contador-input');
        contadorInput.addEventListener('input', () => {
            const stats = Contador.count(contadorInput.value);
            document.querySelector('#resultado-contador span').textContent = `Caracteres: ${stats.caracteres} | Palavras: ${stats.palavras} | Linhas: ${stats.linhas}`;
        });

        // Ferramentas de arquivo
        document.getElementById('convert-pdf').addEventListener('click', () => {
            const fileInput = document.getElementById('image-input');
            if (fileInput.files.length > 0) ImageToPdf.convert(fileInput.files[0], 'resultado-pdf');
            else renderResult('resultado-pdf', 'Por favor, selecione um arquivo primeiro.');
        });

        document.getElementById('analyze-video').addEventListener('click', () => {
            const fileInput = document.getElementById('video-input');
            if (fileInput.files.length > 0) VideoInfo.analyze(fileInput.files[0], 'resultado-video-info');
            else renderResult('resultado-video-info', 'Por favor, selecione um arquivo primeiro.');
        });

        // Explicações
        document.querySelectorAll('.explanation-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault(); 
                const content = document.getElementById(e.target.dataset.target);
                if (content) {
                    e.target.classList.toggle('active');
                    const isVisible = content.style.maxHeight && content.style.maxHeight !== "0px";
                    content.style.maxHeight = isVisible ? "0px" : content.scrollHeight + "px";
                }
            });
        });
    }

    // --- INICIA A APLICAÇÃO ---
    initialize();
});