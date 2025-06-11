document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // ESTADO GLOBAL E INICIALIZAÇÃO
    // =================================================================================
    let state = { currentScenario: {}, history: [], savedScenarios: [] };
    let lastGeneratedData = {};

    function initialize() {
        setupTheme();
        setupWorkspaceUI();
        setupNavigation();
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
            body.classList.toggle('light-mode', theme === 'light');
            body.classList.toggle('dark-mode', theme !== 'light');
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

    // =================================================================================
    // WORKSPACE E PERSISTÊNCIA
    // =================================================================================
    function setupWorkspaceUI() {
        const workspace = document.getElementById('workspace');
        document.getElementById('workspace-toggle-btn').addEventListener('click', () => workspace.classList.add('open'));
        document.getElementById('workspace-close-btn').addEventListener('click', () => workspace.classList.remove('open'));

        document.querySelectorAll('.workspace-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.workspace-tab-btn, .workspace-pane').forEach(el => el.classList.remove('active'));
                e.currentTarget.classList.add('active');
                document.getElementById(e.currentTarget.dataset.target).classList.add('active');
            });
        });

        document.getElementById('clear-cenario-btn').addEventListener('click', () => {
            if (Object.keys(state.currentScenario).length > 0 && confirm("Tem certeza que deseja limpar o cenário atual?")) {
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
                        workspace.classList.add('open');
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
        if (savedState) {
            try { state = JSON.parse(savedState); if(!state.savedScenarios) state.savedScenarios = []; } catch { state = { currentScenario: {}, history: [], savedScenarios: [] }; }
        }
        renderAll();
    }

    // =================================================================================
    // LÓGICA DE NAVEGAÇÃO PRINCIPAL
    // =================================================================================
    function setupNavigation() {
        const toolLinks = document.querySelectorAll('[data-tool]');
        const toolPanes = document.querySelectorAll('.tool-pane');
        const navMenu = document.getElementById('nav-menu');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

        const showTool = (toolId) => {
            toolPanes.forEach(pane => pane.classList.remove('active'));
            const paneToShow = document.getElementById(`${toolId}-pane`);
            if (paneToShow) paneToShow.classList.add('active');
            navMenu.classList.remove('active');
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        };

        toolLinks.forEach(link => {
            link.addEventListener('click', (e) => { e.preventDefault(); showTool(link.dataset.tool); });
        });

        mobileMenuToggle.addEventListener('click', (e) => { e.stopPropagation(); navMenu.classList.toggle('active'); });
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => { if (window.innerWidth <= 768) e.currentTarget.parentElement.classList.toggle('active'); });
        });
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && !navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            }
        });
    }
    
    // =================================================================================
    // RENDERIZAÇÃO DA UI
    // =================================================================================
    function renderAll() { renderCurrentScenario(); renderHistory(); }
    function formatTimeAgo(date) {
        const now = new Date(); const seconds = Math.floor((now - new Date(date)) / 1000);
        if (seconds < 60) return "agora mesmo"; const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min atrás`; const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h atrás`; const days = Math.floor(hours / 24);
        return `${days}d atrás`;
    }
    function renderCurrentScenario() {
        const container = document.getElementById('cenario-content');
        container.innerHTML = '';
        if (Object.keys(state.currentScenario).length === 0) {
            container.innerHTML = '<p class="empty-state">Gere dados e clique em "Adicionar ao Cenário" para começar.</p>';
            return;
        }
        for (const [key, data] of Object.entries(state.currentScenario)) {
            const itemDiv = document.createElement('div'); itemDiv.className = 'cenario-item';
            const title = key.charAt(0).toUpperCase() + key.slice(1);
            const content = typeof data === 'object' ? Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n') : data;
            itemDiv.innerHTML = `<h4>${title}</h4><pre>${content}</pre>`;
            container.appendChild(itemDiv);
        }
    }
    function renderHistory() {
        const container = document.getElementById('historico-content');
        container.innerHTML = '';
        if ((!state.history || state.history.length === 0) && (!state.savedScenarios || state.savedScenarios.length === 0)) {
            container.innerHTML = '<p class="empty-state">Seu histórico e cenários salvos aparecerão aqui.</p>';
            return;
        }
        if (state.savedScenarios && state.savedScenarios.length > 0) {
            let savedHtml = `<h4>Cenários Salvos</h4>`;
            state.savedScenarios.forEach((scenario, index) => {
                const content = Object.entries(scenario.data).map(([k, v]) => (typeof v === 'object' ? `${k}:\n  ${Object.entries(v).map(([sk,sv])=>`${sk}: ${sv}`).join('\n  ')}` : `${k}: ${v}`)).join('\n');
                savedHtml += `<div class="historico-item"><h4>${scenario.name} <button class="btn-danger" title="Excluir cenário" style="padding: 2px 8px; font-size: 0.8rem;" onclick="removeScenario(${index})">X</button></h4><pre>${content}</pre></div>`;
            });
            container.innerHTML += savedHtml;
        }
        if (state.history && state.history.length > 0) {
            let historyHtml = `<h4 style="margin-top: 1.5rem;">Últimos Itens Gerados</h4>`;
            state.history.forEach((item, index) => {
                const content = typeof item.data === 'object' ? Object.entries(item.data).map(([k,v])=>`${k}: ${v}`).join('\n') : item.data;
                historyHtml += `<div class="history-card">
                    <div class="history-card-header"><span class="type">${item.type}</span><span class="timestamp">${formatTimeAgo(item.timestamp)}</span></div>
                    <div class="history-card-body"><pre>${content}</pre></div>
                    <div class="history-card-actions">
                        <button class="btn-icon" data-history-copy-index="${index}">Copiar</button>
                        ${item.isScenarioData ? `<button class="btn-icon" data-history-add-index="${index}">+ Cenário</button>` : ''}
                    </div>
                </div>`;
            });
            container.innerHTML += historyHtml;
        }
    }
    window.removeScenario = function(index) {
        if (confirm(`Tem certeza que deseja excluir o cenário "${state.savedScenarios[index].name}"?`)) {
            state.savedScenarios.splice(index, 1);
            saveState();
            renderHistory();
        }
    }
    function addToHistory(type, data, isScenarioData = false) {
        if(!state.history) state.history = [];
        state.history.unshift({ type, data, isScenarioData, timestamp: new Date() });
        if (state.history.length > 15) state.history.pop();
        saveState();
        renderHistory();
    }
    function addToScenario(type) {
        if (lastGeneratedData[type]) {
            let key = type.charAt(0).toUpperCase() + type.slice(1);
            if (state.currentScenario.Pessoa && ['cnpj', 'cnh', 'cartao'].includes(type)) {
                 const nome = state.currentScenario.Pessoa.Nome.split(' ')[0];
                 key = `${key} de ${nome}`;
            }
            state.currentScenario[key] = lastGeneratedData[type];
            saveState();
            renderCurrentScenario();
            document.getElementById('workspace').classList.add('open');
            document.querySelector('.workspace-tab-btn[data-target="workspace-cenario"]').click();
        } else { alert("Gere um dado primeiro antes de adicionar ao cenário."); }
    }
    function copyToClipboard(str, button) {
        navigator.clipboard.writeText(str).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copiado!';
            setTimeout(() => { button.textContent = originalText; }, 1500);
        });
    }
    function renderResult(elementId, content, isPreformatted = false) {
        const resultBox = document.getElementById(elementId);
        resultBox.innerHTML = '';
        const textElement = document.createElement(isPreformatted ? 'pre' : 'span');
        textElement.textContent = content;
        const hasContent = content && !String(content).toLowerCase().includes("...") && !String(content).toLowerCase().includes("aguardando") && !String(content).toLowerCase().includes("selecione");
        resultBox.classList.toggle('has-content', hasContent);
        if (hasContent) {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.innerHTML = '📋';
            copyButton.title = "Copiar";
            copyButton.onclick = () => copyToClipboard(content, copyButton);
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

    function setupEventListeners() {
        const handleSimpleGeneration = (toolType, generatorFn, resultBoxId, isPreformatted = false) => {
            const data = generatorFn();
            renderResult(resultBoxId, data, isPreformatted);
            addToHistory(toolType, data, false);
        };
        const handleScenarioGeneration = (toolType, generatorFn, resultBoxId) => {
            const data = generatorFn();
            lastGeneratedData[toolType] = data;
            const content = typeof data === 'object' ? Object.entries(data).map(([k,v])=>`${k}: ${v}`).join('\n') : data;
            renderResult(resultBoxId, content, true);
            addToHistory(toolType.charAt(0).toUpperCase() + toolType.slice(1), data, true);
            document.getElementById(`add-${toolType}-to-cenario`).style.display = 'block';
        };

        // Event Listeners
        document.getElementById('gerar-pessoa').addEventListener('click', () => handleScenarioGeneration('pessoa', () => Pessoa.generate(document.getElementById('pessoa-idade-especifica-check').checked ? parseInt(document.getElementById('pessoa-idade').value, 10) || 25 : Math.floor(Math.random()*(60-18+1))+18), 'resultado-pessoa'));
        document.getElementById('gerar-cnpj').addEventListener('click', () => handleScenarioGeneration('cnpj', () => Cnpj.generate(document.getElementById('cnpj-pontuacao').checked), 'resultado-cnpj'));
        document.getElementById('gerar-cnh').addEventListener('click', () => handleScenarioGeneration('cnh', () => Cnh.generate(document.getElementById('cnh-formatacao').checked), 'resultado-cnh'));
        document.getElementById('gerar-cartao').addEventListener('click', () => handleScenarioGeneration('cartao', () => Cartao.generate(document.getElementById('cartao-bandeira').value), 'resultado-cartao'));
        document.getElementById('add-pessoa-to-cenario').addEventListener('click', () => addToScenario('pessoa'));
        document.getElementById('add-cnpj-to-cenario').addEventListener('click', () => addToScenario('cnpj'));
        document.getElementById('add-cnh-to-cenario').addEventListener('click', () => addToScenario('cnh'));
        document.getElementById('add-cartao-to-cenario').addEventListener('click', () => addToScenario('cartao'));

        document.getElementById('gerar-cpf').addEventListener('click', () => handleSimpleGeneration('CPF', () => Cpf.generate(document.getElementById('cpf-pontuacao').checked), 'resultado-cpf'));
        document.getElementById('gerar-senha').addEventListener('click', () => handleSimpleGeneration('Senha', () => Senha.generate(document.getElementById('senha-tamanho').value, document.getElementById('senha-maiusculas').checked, document.getElementById('senha-minusculas').checked, document.getElementById('senha-numeros').checked, document.getElementById('senha-simbolos').checked), 'resultado-senha'));
        document.getElementById('gerar-uuid').addEventListener('click', () => handleSimpleGeneration('UUID', Uuid.generate, 'resultado-uuid'));
        document.getElementById('gerar-lorem').addEventListener('click', () => handleSimpleGeneration('Lorem Ipsum', () => Lorem.generate(document.getElementById('lorem-paragrafos').value), 'resultado-lorem', true));
        
        document.getElementById('gerar-qrcode').addEventListener('click', () => QrCodeGenerator.generate(document.getElementById('qrcode-texto').value, 'resultado-qrcode'));
        document.getElementById('base64-codificar').addEventListener('click', () => { const text = document.getElementById('base64-input').value; renderResult('resultado-base64', Base64.encode(text), true); addToHistory('Base64 (Codificado)', text); });
        document.getElementById('base64-decodificar').addEventListener('click', () => { const text = document.getElementById('base64-input').value; renderResult('resultado-base64', Base64.decode(text), true); addToHistory('Base64 (Decodificado)', text); });
        
        document.getElementById('contador-input').addEventListener('input', (e) => { const stats = Contador.count(e.target.value); document.querySelector('#resultado-contador span').textContent = `Caracteres: ${stats.caracteres} | Palavras: ${stats.palavras} | Linhas: ${stats.linhas}`; });

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
        
        const jwtInput = document.getElementById('jwt-input');
        jwtInput.addEventListener('input', () => {
            const token = jwtInput.value; const resultBox = document.getElementById('resultado-jwt');
            if (!token) { renderResult('resultado-jwt', 'Aguardando um token...'); return; }
            const result = JwtDebugger.decode(token);
            if (result.error) {
                renderResult('resultado-jwt', result.error); resultBox.querySelector('span').classList.add('jwt-error');
            } else {
                let html = `<div class="jwt-part"><h4 class="jwt-part-title">Header</h4><pre class="jwt-part-content">${JSON.stringify(result.header, null, 2)}</pre></div><div class="jwt-part"><h4 class="jwt-part-title">Payload</h4><pre class="jwt-part-content">${JSON.stringify(result.payload, null, 2)}</pre></div>`;
                if(result.extra) { html += `<div class="jwt-part"><h4 class="jwt-part-title">Verificação</h4><pre class="jwt-part-content">Expiração: ${result.extra.expiracao}\nStatus: <span class="jwt-status ${result.extra.status.toLowerCase()}">${result.extra.status}</span></pre></div>`; }
                resultBox.innerHTML = html; addToHistory('JWT Decodificado', token);
            }
        });

        const regexPattern = document.getElementById('regex-pattern');
        const regexFlags = document.getElementById('regex-flags');
        const regexTestString = document.getElementById('regex-test-string');
        function runRegexTest() {
            const result = RegexTester.test(regexPattern.value, regexFlags.value, regexTestString.value);
            const highlightBox = document.getElementById('resultado-regex-highlight');
            const matchesBox = document.getElementById('resultado-regex-matches');
            if (result.error) {
                highlightBox.innerHTML = `<span class="jwt-error">${result.error}</span>`;
                matchesBox.textContent = 'Erro na expressão.';
            } else {
                highlightBox.innerHTML = result.highlightedHtml || '<span>Aguardando texto...</span>';
                matchesBox.textContent = `Correspondências encontradas: ${result.matchCount}\n\n${result.matches.slice(0, 100).join('\n')}`; // Limita matches
            }
        }
        regexPattern.addEventListener('input', runRegexTest);
        regexFlags.addEventListener('input', runRegexTest);
        regexTestString.addEventListener('input', runRegexTest);
        
        document.getElementById('url-encode-btn').addEventListener('click', () => { const input = document.getElementById('url-encoder-input').value; renderResult('resultado-url-encoder', UrlEncoder.encode(input), true); addToHistory('URL (Codificado)', input); });
        document.getElementById('url-decode-btn').addEventListener('click', () => { const input = document.getElementById('url-encoder-input').value; renderResult('resultado-url-encoder', UrlEncoder.decode(input), true); addToHistory('URL (Decodificado)', input); });

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
        
        document.getElementById('historico-content').addEventListener('click', (e) => {
            const copyBtn = e.target.closest('[data-history-copy-index]');
            const addBtn = e.target.closest('[data-history-add-index]');
            if (copyBtn) {
                const index = parseInt(copyBtn.dataset.historyCopyIndex, 10);
                const item = state.history[index];
                const contentToCopy = typeof item.data === 'object' ? Object.entries(item.data).map(([k,v])=>`${k}: ${v}`).join('\n') : item.data;
                copyToClipboard(contentToCopy, copyBtn);
            }
            if (addBtn) {
                const index = parseInt(addBtn.dataset.historyAddIndex, 10);
                const item = state.history[index];
                lastGeneratedData[item.type.toLowerCase()] = item.data;
                addToScenario(item.type.toLowerCase());
            }
        });
    }

    initialize();
});