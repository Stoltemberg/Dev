document.addEventListener('DOMContentLoaded', () => {
    let state = { currentScenario: {}, history: [], savedScenarios: [] };
    let lastGeneratedData = {};

    function initialize() {
        setupTheme();
        setupWorkspaceUI();
        setupTabs();
        setupEventListeners();
        loadState();
    }

    function setupTheme() {
        const themeSwitcher = document.getElementById('theme-switcher');
        const body = document.body;
        const applyTheme = (theme) => {
            body.classList.toggle('light-mode', theme === 'light');
            themeSwitcher.innerHTML = theme === 'light' ? '🌙' : '☀️';
        };
        const currentTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(currentTheme);
        themeSwitcher.addEventListener('click', () => {
            const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    function setupWorkspaceUI() {
        const workspace = document.getElementById('workspace');
        document.getElementById('workspace-toggle-btn').addEventListener('click', () => workspace.classList.add('open'));
        document.getElementById('workspace-close-btn').addEventListener('click', () => workspace.classList.remove('open'));

        document.querySelectorAll('.workspace-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.workspace-tab-btn, .workspace-pane').forEach(el => el.classList.remove('active'));
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
            } else { alert("O cenário atual está vazio."); }
        });

        document.getElementById('export-cenario-btn').addEventListener('click', () => {
            if (Object.keys(state.currentScenario).length === 0) {
                alert("O cenário atual está vazio. Adicione itens antes de exportar.");
                return;
            }
            const dataStr = JSON.stringify(state.currentScenario, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cenario-devtools-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });

        const importFileInput = document.getElementById('import-file-input');
        document.getElementById('import-cenario-btn').addEventListener('click', () => importFileInput.click());
        importFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedScenario = JSON.parse(e.target.result);
                    if (confirm("Isso substituirá seu cenário atual. Deseja continuar?")) {
                        state.currentScenario = importedScenario;
                        saveState();
                        renderAll();
                        document.getElementById('workspace').classList.add('open');
                    }
                } catch (error) { alert("Erro ao ler o arquivo. Por favor, verifique se é um arquivo JSON válido."); }
            };
            reader.readAsText(file);
            event.target.value = '';
        });
    }

    function saveState() { localStorage.setItem('devtools_state', JSON.stringify(state)); }
    function loadState() {
        const savedState = localStorage.getItem('devtools_state');
        if (savedState) state = JSON.parse(savedState);
        renderAll();
    }

    function renderAll() { renderCurrentScenario(); renderHistory(); }
    
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
            container.innerHTML += `<h4>Cenários Salvos</h4>`;
            state.savedScenarios.forEach((scenario, index) => {
                const content = Object.entries(scenario.data).map(([k, v]) => (typeof v === 'object' ? `${k}:\n  ${Object.entries(v).map(([sk,sv])=>`${sk}: ${sv}`).join('\n  ')}` : `${k}: ${v}`)).join('\n');
                container.innerHTML += `<div class="historico-item"><h4>${scenario.name} <button class="btn-danger" title="Excluir cenário" style="padding: 2px 8px; font-size: 0.8rem;" onclick="removeScenario(${index})">X</button></h4><pre>${content}</pre></div>`;
            });
        }
        if (state.history.length > 0) {
            container.innerHTML += `<h4 style="margin-top: 1.5rem;">Últimos Itens Gerados</h4>`;
            state.history.forEach(item => {
                const content = typeof item.data === 'object' ? Object.entries(item.data).map(([k,v])=>`${k}: ${v}`).join('\n') : item.data;
                container.innerHTML += `<div class="historico-item"><h4>${item.type}</h4><pre>${content}</pre></div>`;
            });
        }
    }
    
    window.removeScenario = function(index) {
        if (confirm(`Tem certeza que deseja excluir o cenário "${state.savedScenarios[index].name}"?`)) {
            state.savedScenarios.splice(index, 1);
            saveState();
            renderHistory();
        }
    }
    
    function addToHistory(type, data) {
        state.history.unshift({ type, data });
        if (state.history.length > 15) state.history.pop();
        saveState();
        renderHistory();
    }
    
    function addToScenario(type) {
        if (lastGeneratedData[type]) {
            let key = type;
            if (state.currentScenario.pessoa && ['cnpj', 'cnh', 'cartao'].includes(type)) {
                 const nome = state.currentScenario.pessoa.Nome.split(' ')[0];
                 key = `${type.charAt(0).toUpperCase() + type.slice(1)} de ${nome}`;
            }
            state.currentScenario[key] = lastGeneratedData[type];
            saveState();
            renderCurrentScenario();
            document.getElementById('workspace').classList.add('open');
            document.querySelector('.workspace-tab-btn[data-target="workspace-cenario"]').click();
        } else {
            alert("Gere um dado primeiro antes de adicionar ao cenário.");
        }
    }

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
        const hasContent = content && !String(content).toLowerCase().includes("clique em") && !String(content).toLowerCase().includes("aguardando") && !String(content).toLowerCase().includes("selecione");
        if (hasContent) {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.innerHTML = '📋';
            copyButton.onclick = () => copyToClipboard(content);
            resultBox.appendChild(copyButton);
        }
        resultBox.appendChild(textElement);
    }
    
    function showSpinner(button) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<div class="spinner"></div>';
        button.classList.add('btn-loading');
    }

    function hideSpinner(button) {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || 'Gerar';
        button.classList.remove('btn-loading');
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
        addToHistory(toolType, data);
    }
    
    function handleScenarioGeneration(toolType, generatorFn, resultBoxId) {
        const data = generatorFn();
        lastGeneratedData[toolType] = data;
        const content = typeof data === 'object' ? Object.entries(data).map(([k,v])=>`${k}: ${v}`).join('\n') : data;
        renderResult(resultBoxId, content, true);
        addToHistory(toolType.charAt(0).toUpperCase() + toolType.slice(1), data);
        document.getElementById(`add-${toolType}-to-cenario`).style.display = 'block';
    }

    function setupEventListeners() {
        // Cenário
        document.getElementById('gerar-pessoa').addEventListener('click', () => handleScenarioGeneration('pessoa', () => Pessoa.generate(document.getElementById('pessoa-idade-especifica-check').checked ? parseInt(document.getElementById('pessoa-idade').value, 10) || 25 : Math.floor(Math.random()*(60-18+1))+18), 'resultado-pessoa'));
        document.getElementById('gerar-cnpj').addEventListener('click', () => handleScenarioGeneration('cnpj', () => Cnpj.generate(document.getElementById('cnpj-pontuacao').checked), 'resultado-cnpj'));
        document.getElementById('gerar-cnh').addEventListener('click', () => handleScenarioGeneration('cnh', () => Cnh.generate(document.getElementById('cnh-formatacao').checked), 'resultado-cnh'));
        document.getElementById('gerar-cartao').addEventListener('click', () => handleScenarioGeneration('cartao', () => Cartao.generate(document.getElementById('cartao-bandeira').value), 'resultado-cartao'));

        document.getElementById('add-pessoa-to-cenario').addEventListener('click', () => addToScenario('pessoa'));
        document.getElementById('add-cnpj-to-cenario').addEventListener('click', () => addToScenario('cnpj'));
        document.getElementById('add-cnh-to-cenario').addEventListener('click', () => addToScenario('cnh'));
        document.getElementById('add-cartao-to-cenario').addEventListener('click', () => addToScenario('cartao'));

        // Simples
        document.getElementById('gerar-cpf').addEventListener('click', () => handleSimpleGeneration('CPF', () => Cpf.generate(document.getElementById('cpf-pontuacao').checked), 'resultado-cpf'));
        document.getElementById('gerar-senha').addEventListener('click', () => handleSimpleGeneration('Senha', () => Senha.generate(document.getElementById('senha-tamanho').value, document.getElementById('senha-maiusculas').checked, document.getElementById('senha-minusculas').checked, document.getElementById('senha-numeros').checked, document.getElementById('senha-simbolos').checked), 'resultado-senha'));
        document.getElementById('gerar-uuid').addEventListener('click', () => handleSimpleGeneration('UUID', Uuid.generate, 'resultado-uuid'));
        document.getElementById('gerar-lorem').addEventListener('click', () => handleSimpleGeneration('Lorem Ipsum', () => Lorem.generate(document.getElementById('lorem-paragrafos').value), 'resultado-lorem', true));

        // Interativos
        document.getElementById('gerar-qrcode').addEventListener('click', () => QrCodeGenerator.generate(document.getElementById('qrcode-texto').value, 'resultado-qrcode'));
        document.getElementById('base64-codificar').addEventListener('click', () => renderResult('resultado-base64', Base64.encode(document.getElementById('base64-input').value), true));
        document.getElementById('base64-decodificar').addEventListener('click', () => renderResult('resultado-base64', Base64.decode(document.getElementById('base64-input').value), true));
        
        document.getElementById('contador-input').addEventListener('input', (e) => {
            const stats = Contador.count(e.target.value);
            document.querySelector('#resultado-contador span').textContent = `Caracteres: ${stats.caracteres} | Palavras: ${stats.palavras} | Linhas: ${stats.linhas}`;
        });

        // Arquivos
        const convertPdfBtn = document.getElementById('convert-pdf');
        convertPdfBtn.addEventListener('click', () => {
            const fileInput = document.getElementById('image-input');
            if (fileInput.files.length > 0) {
                showSpinner(convertPdfBtn);
                setTimeout(() => ImageToPdf.convert(fileInput.files[0], 'resultado-pdf', () => hideSpinner(convertPdfBtn)), 50);
            } else { renderResult('resultado-pdf', 'Por favor, selecione um arquivo primeiro.'); }
        });
        const analyzeVideoBtn = document.getElementById('analyze-video');
        analyzeVideoBtn.addEventListener('click', () => {
            const fileInput = document.getElementById('video-input');
            if (fileInput.files.length > 0) {
                showSpinner(analyzeVideoBtn);
                setTimeout(() => VideoInfo.analyze(fileInput.files[0], 'resultado-video-info', () => hideSpinner(analyzeVideoBtn)), 50);
            } else { renderResult('resultado-video-info', 'Por favor, selecione um arquivo primeiro.'); }
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

    initialize();
});