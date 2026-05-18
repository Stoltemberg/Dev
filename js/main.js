// Estado da aplicação com gerenciamento de memória otimizado
const AppState = {
    currentScenario: {},
    history: [],
    savedScenarios: [],
    lastGeneratedData: {},
    
    // Métodos para manipulação do estado
    saveState() {
        try {
            const stateToSave = {
                currentScenario: this.currentScenario,
                savedScenarios: this.savedScenarios,
                history: this.history.slice(-50) // Mantém apenas os últimos 50 itens
            };
            localStorage.setItem('devtools_state', JSON.stringify(stateToSave));
        } catch (error) {
            console.warn('Erro ao salvar estado:', error);
        }
    },
    
    loadState() {
        try {
            const savedState = localStorage.getItem('devtools_state');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                this.currentScenario = parsed.currentScenario || {};
                this.savedScenarios = parsed.savedScenarios || [];
                this.history = parsed.history || [];
            }
        } catch (error) {
            console.warn('Erro ao carregar estado:', error);
            this.resetState();
        }
    },
    
    resetState() {
        this.currentScenario = {};
        this.history = [];
        this.savedScenarios = [];
        this.lastGeneratedData = {};
    },
    
    addToHistory(type, data, isScenarioData = false) {
        const entry = {
            type,
            data,
            timestamp: Date.now(),
            isScenarioData
        };
        this.history.unshift(entry);
        if (this.history.length > 50) this.history.pop();
        this.saveState();
    }
};

// Inicialização otimizada
document.addEventListener("DOMContentLoaded", () => {
    // Carrega o estado inicial
    AppState.loadState();
    
    // Configuração inicial otimizada
    const initPromises = [
        setupTheme(),
        setupWorkspaceUI(),
        setupNavigation(),
        loadPasswordOptions(),
        setupEventListeners()
    ];
    
    // Executa todas as configurações em paralelo
    Promise.all(initPromises)
        .then(() => {
            renderAll();
            // Notifica que a aplicação está pronta
            document.documentElement.classList.add('app-ready');
        })
        .catch(error => {
            console.error('Erro na inicialização:', error);
        });
});

// Funções de UI otimizadas
function setupTheme() {
    const themeSwitcher = document.getElementById("theme-switcher");
    const body = document.body;
    
    // Usa requestAnimationFrame para transições suaves
    const applyTheme = theme => {
        requestAnimationFrame(() => {
            body.classList.toggle("light-mode", theme === "light");
            body.classList.toggle("dark-mode", theme !== "light");
        });
    };
    
    // Carrega tema salvo
    const currentTheme = localStorage.getItem("theme") || "dark";
    applyTheme(currentTheme);
    
    // Event listener otimizado
    themeSwitcher.addEventListener("click", () => {
        const newTheme = body.classList.contains("light-mode") ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    });
}

// Funções de renderização otimizadas
function renderAll() {
    requestAnimationFrame(() => {
        renderCurrentScenario();
        renderHistory();
    });
}

function renderCurrentScenario() {
    const container = document.getElementById("current-scenario");
    if (!container) return;
    
    // Usa DocumentFragment para melhor performance
    const fragment = document.createDocumentFragment();
    
    if (Object.keys(AppState.currentScenario).length === 0) {
        fragment.appendChild(createEmptyStateMessage());
    } else {
        Object.entries(AppState.currentScenario).forEach(([type, data]) => {
            fragment.appendChild(createScenarioItem(type, data));
        });
    }
    
    // Limpa e atualiza o container
    container.innerHTML = '';
    container.appendChild(fragment);
}

// Funções de utilidade otimizadas
function copyToClipboard(str, button) {
    if (!navigator.clipboard) {
        // Fallback para navegadores antigos
        const textArea = document.createElement('textarea');
        textArea.value = str;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showCopySuccess(button);
        } catch (err) {
            console.error('Erro ao copiar:', err);
        }
        document.body.removeChild(textArea);
        return;
    }
    
    // Usa a API moderna
    navigator.clipboard.writeText(str)
        .then(() => showCopySuccess(button))
        .catch(err => console.error('Erro ao copiar:', err));
}

function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = '✓ Copiado!';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// Funções de geração otimizadas
function handleSimpleGeneration(toolType, generatorFn, resultBoxId, isPreformatted = false) {
    return async (event) => {
        event.preventDefault();
        const button = event.target;
        
        try {
            showSpinner(button);
            const result = await generatorFn();
            AppState.lastGeneratedData[toolType] = result;
            
            renderResult(resultBoxId, result, isPreformatted);
            AppState.addToHistory(toolType, result);
            
            if (document.getElementById("add-to-scenario").checked) {
                AppState.addToScenario(toolType);
            }
        } catch (error) {
            console.error(`Erro ao gerar ${toolType}:`, error);
            renderResult(resultBoxId, 'Erro ao gerar. Tente novamente.', false);
        } finally {
            hideSpinner(button);
        }
    };
}

function setupWorkspaceUI() {
    const workspace = document.getElementById("workspace");
    document
      .getElementById("workspace-toggle-btn")
      .addEventListener("click", () => workspace.classList.add("open"));
    document
      .getElementById("workspace-close-btn")
      .addEventListener("click", () => workspace.classList.remove("open"));
    document.querySelectorAll(".workspace-tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".workspace-tab-btn, .workspace-pane")
          .forEach((el) => el.classList.remove("active"));
        e.currentTarget.classList.add("active");
        document
          .getElementById(e.currentTarget.dataset.target)
          .classList.add("active");
      });
    });
    document
      .getElementById("clear-cenario-btn")
      .addEventListener("click", () => {
        if (
          Object.keys(AppState.currentScenario).length > 0 &&
          confirm("Tem certeza que deseja limpar o cenário atual?")
        ) {
          AppState.currentScenario = {};
          AppState.saveState();
          renderAll();
        }
      });
    document
      .getElementById("save-cenario-btn")
      .addEventListener("click", () => {
        if (Object.keys(AppState.currentScenario).length > 0) {
          const scenarioName = prompt(
            "Digite um nome para este cenário:",
            "Cenário " + (AppState.savedScenarios.length + 1)
          );
          if (scenarioName) {
            AppState.savedScenarios.unshift({
              name: scenarioName,
              data: { ...AppState.currentScenario },
            });
            AppState.currentScenario = {};
            AppState.saveState();
            renderAll();
          }
        } else {
          alert("O cenário atual está vazio.");
        }
      });
    document
      .getElementById("export-cenario-btn")
      .addEventListener("click", () => {
        if (Object.keys(AppState.currentScenario).length === 0) {
          alert("O cenário atual está vazio.");
          return;
        }
        const dataStr = JSON.stringify(AppState.currentScenario, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cenario-devtools-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    const importFileInput = document.getElementById("import-file-input");
    document
      .getElementById("import-cenario-btn")
      .addEventListener("click", () => importFileInput.click());
    importFileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedScenario = JSON.parse(e.target.result);
          if (
            confirm("Isso substituirá seu cenário atual. Deseja continuar?")
          ) {
            AppState.currentScenario = importedScenario;
            AppState.saveState();
            renderAll();
            workspace.classList.add("open");
          }
        } catch (error) {
          alert(
            "Erro ao ler o arquivo. Por favor, verifique se é um arquivo JSON válido."
          );
        }
      };
      reader.readAsText(file);
      event.target.value = "";
    });
}

function setupNavigation() {
    const toolLinks = document.querySelectorAll("[data-tool]");
    const toolPanes = document.querySelectorAll(".tool-pane");
    const navMenu = document.getElementById("nav-menu");
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const showTool = (toolId) => {
      toolPanes.forEach((pane) => pane.classList.remove("active"));
      const paneToShow = document.getElementById(`${toolId}-pane`);
      if (paneToShow) paneToShow.classList.add("active");
      navMenu.classList.remove("active");
      document
        .querySelectorAll(".dropdown")
        .forEach((d) => d.classList.remove("active"));
    };
    toolLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        showTool(link.dataset.tool);
      });
    });
    mobileMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navMenu.classList.toggle("active");
    });
    document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        if (window.innerWidth <= 768)
          e.currentTarget.parentElement.classList.toggle("active");
      });
    });
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 768 &&
        !navMenu.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)
      ) {
        navMenu.classList.remove("active");
        document
          .querySelectorAll(".dropdown")
          .forEach((d) => d.classList.remove("active"));
      }
    });
}

function savePasswordOptions() {
    const options = {
      length: document.getElementById("senha-tamanho").value,
      useMaiusculas: document.getElementById("senha-maiusculas").checked,
      useMinusculas: document.getElementById("senha-minusculas").checked,
      useNumeros: document.getElementById("senha-numeros").checked,
      useSimbolos: document.getElementById("senha-simbolos").checked,
    };
    localStorage.setItem("devtools_password_options", JSON.stringify(options));
    const saveBtn = document.getElementById("save-password-options");
    saveBtn.textContent = "Opções Salvas!";
    setTimeout(() => {
      saveBtn.textContent = "Salvar Opções";
    }, 2000);
}
function loadPasswordOptions() {
    const savedOptions = localStorage.getItem("devtools_password_options");
    if (savedOptions) {
      const options = JSON.parse(savedOptions);
      document.getElementById("senha-tamanho").value = options.length;
      document.getElementById("senha-maiusculas").checked =
        options.useMaiusculas;
      document.getElementById("senha-minusculas").checked =
        options.useMinusculas;
      document.getElementById("senha-numeros").checked = options.useNumeros;
      document.getElementById("senha-simbolos").checked = options.useSimbolos;
    }
  }

function renderHistory() {
    const container = document.getElementById("historico-content");
    container.innerHTML = "";
    if (
      (!AppState.history || AppState.history.length === 0) &&
      (!AppState.savedScenarios || AppState.savedScenarios.length === 0)
    ) {
      container.innerHTML =
        '<p class="empty-state">Seu histórico e cenários salvos aparecerão aqui.</p>';
      return;
    }
    if (AppState.savedScenarios && AppState.savedScenarios.length > 0) {
      let savedHtml = `<h4>Cenários Salvos</h4>`;
      AppState.savedScenarios.forEach((scenario, index) => {
        const content = Object.entries(scenario.data)
          .map(([k, v]) =>
            typeof v === "object"
              ? `${k}:\n  ${Object.entries(v)
                  .map(([sk, sv]) => `${sk}: ${sv}`)
                  .join("\n  ")}`
              : `${k}: ${v}`
          )
          .join("\n");
        savedHtml += `<div class="historico-item"><h4>${scenario.name} <button class="btn-danger" title="Excluir cenário" style="padding: 2px 8px; font-size: 0.8rem;" onclick="removeScenario(${index})">X</button></h4><pre>${content}</pre></div>`;
      });
      container.innerHTML += savedHtml;
    }
    if (AppState.history && AppState.history.length > 0) {
      let historyHtml = `<h4 style="margin-top: 1.5rem;">Últimos Itens Gerados</h4>`;
      AppState.history.forEach((item, index) => {
        const content =
          typeof item.data === "object"
            ? Object.entries(item.data)
                .map(([k, v]) => `${k}: ${v}`)
                .join("\n")
            : item.data;
        historyHtml += `<div class="history-card"><div class="history-card-header"><span class="type">${
          item.type
        }</span><span class="timestamp">${formatTimeAgo(
          item.timestamp
        )}</span></div><div class="history-card-body"><pre>${content}</pre></div><div class="history-card-actions"><button class="btn-icon" data-history-copy-index="${index}">Copiar</button>${
          item.isScenarioData
            ? `<button class="btn-icon" data-history-add-index="${index}">+ Cenário</button>`
            : ""
        }</div></div>`;
      });
      container.innerHTML += historyHtml;
    }
  }
  window.removeScenario = function (index) {
    if (
      confirm(
        `Tem certeza que deseja excluir o cenário "${AppState.savedScenarios[index].name}"?`
      )
    ) {
      AppState.savedScenarios.splice(index, 1);
      AppState.saveState();
      renderHistory();
    }
  };
  function addToScenario(type) {
    if (AppState.lastGeneratedData[type]) {
      let key = type.charAt(0).toUpperCase() + type.slice(1);
      if (
        AppState.currentScenario.Pessoa &&
        ["cnpj", "cnh", "cartao"].includes(type)
      ) {
        const nome = AppState.currentScenario.Pessoa.Nome.split(" ")[0];
        key = `${key} de ${nome}`;
      }
      AppState.currentScenario[key] = AppState.lastGeneratedData[type];
      AppState.saveState();
      renderCurrentScenario();
      document.getElementById("workspace").classList.add("open");
      document
        .querySelector('.workspace-tab-btn[data-target="workspace-cenario"]')
        .click();
    } else {
      alert("Gere um dado primeiro antes de adicionar ao cenário.");
    }
  }
  function renderResult(elementId, content, isPreformatted = false) {
    const resultBox = document.getElementById(elementId);
    resultBox.innerHTML = "";
    const textElement = document.createElement(isPreformatted ? "pre" : "span");
    const strContent = String(content);
    const hasContent =
      strContent &&
      !strContent.toLowerCase().includes("...") &&
      !strContent.toLowerCase().includes("aguardando") &&
      !strContent.toLowerCase().includes("selecione");
    resultBox.classList.toggle("has-content", hasContent);
    if (hasContent) {
      let i = 0;
      textElement.textContent = "";
      function typeWriter() {
        if (i < strContent.length) {
          textElement.textContent += strContent.charAt(i);
          i++;
          setTimeout(typeWriter, 5);
        }
      }
      typeWriter();
      const copyButton = document.createElement("button");
      copyButton.className = "copy-btn";
      copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      copyButton.title = "Copiar";
      copyButton.setAttribute(
        "aria-label",
        "Copiar para a área de transferência"
      );
      copyButton.onclick = () => copyToClipboard(content, copyButton);
      resultBox.appendChild(copyButton);
    } else {
        textElement.textContent = strContent;
    }
    resultBox.appendChild(textElement);
  }
  function showSpinner(button) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = '<div class="spinner"></div>';
    button.classList.add("btn-loading");
  }
  function hideSpinner(button) {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || "Gerar";
    button.classList.remove("btn-loading");
  }

  function setupEventListeners() {
    const handleSimpleGeneration = (
      toolType,
      generatorFn,
      resultBoxId,
      isPreformatted = false
    ) => {
      const data = generatorFn();
      renderResult(resultBoxId, data, isPreformatted);
      AppState.addToHistory(toolType, data, false);
    };
    const handleScenarioGeneration = (toolType, generatorFn, resultBoxId) => {
      const data = generatorFn();
      AppState.lastGeneratedData[toolType] = data;
      const content =
        typeof data === "object"
          ? Object.entries(data)
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n")
          : data;
      renderResult(resultBoxId, content, true);
      AppState.addToHistory(
        toolType.charAt(0).toUpperCase() + toolType.slice(1),
        data,
        true
      );
      document.getElementById(`add-${toolType}-to-cenario`).style.display =
        "block";
    };

    // Event Listeners
    document
      .getElementById("gerar-pessoa")
      .addEventListener("click", () =>
        handleScenarioGeneration(
          "pessoa",
          () =>
            Pessoa.generate(
              document.getElementById("pessoa-idade-especifica-check").checked
                ? parseInt(document.getElementById("pessoa-idade").value, 10) ||
                    25
                : Math.floor(Math.random() * (60 - 18 + 1)) + 18
            ),
          "resultado-pessoa"
        )
      );
    document
      .getElementById("gerar-cnpj")
      .addEventListener("click", () =>
        handleScenarioGeneration(
          "cnpj",
          () =>
            Cnpj.generate(document.getElementById("cnpj-pontuacao").checked),
          "resultado-cnpj"
        )
      );
    document
      .getElementById("gerar-cnh")
      .addEventListener("click", () =>
        handleScenarioGeneration(
          "cnh",
          () => Cnh.generate(document.getElementById("cnh-formatacao").checked),
          "resultado-cnh"
        )
      );
    document
      .getElementById("gerar-cartao")
      .addEventListener("click", () =>
        handleScenarioGeneration(
          "cartao",
          () =>
            Cartao.generate(document.getElementById("cartao-bandeira").value),
          "resultado-cartao"
        )
      );
    document
      .getElementById("add-pessoa-to-cenario")
      .addEventListener("click", () => addToScenario("pessoa"));
    document
      .getElementById("add-cnpj-to-cenario")
      .addEventListener("click", () => addToScenario("cnpj"));
    document
      .getElementById("add-cnh-to-cenario")
      .addEventListener("click", () => addToScenario("cnh"));
    document
      .getElementById("add-cartao-to-cenario")
      .addEventListener("click", () => addToScenario("cartao"));

    document
      .getElementById("gerar-cpf")
      .addEventListener("click", () =>
        handleSimpleGeneration(
          "CPF",
          () => Cpf.generate(document.getElementById("cpf-pontuacao").checked),
          "resultado-cpf",
          true
        )
      );
    document.getElementById("gerar-cpf-massa").addEventListener("click", () => {
      const quantity =
        parseInt(document.getElementById("cpf-bulk-quantity").value, 10) || 1;
      const comPontos = document.getElementById("cpf-pontuacao").checked;
      const bulkResults = Array.from({ length: quantity }, () =>
        Cpf.generate(comPontos)
      );
      const resultString = bulkResults.join("\n");
      renderResult("resultado-cpf", resultString, true);
      AppState.addToHistory(`${quantity} CPFs Gerados`, resultString, false);
    });

    document
      .getElementById("gerar-senha")
      .addEventListener("click", () =>
        handleSimpleGeneration(
          "Senha",
          () =>
            Senha.generate(
              document.getElementById("senha-tamanho").value,
              document.getElementById("senha-maiusculas").checked,
              document.getElementById("senha-minusculas").checked,
              document.getElementById("senha-numeros").checked,
              document.getElementById("senha-simbolos").checked
            ),
          "resultado-senha"
        )
      );
    document
      .getElementById("save-password-options")
      .addEventListener("click", savePasswordOptions);

    document
      .getElementById("gerar-uuid")
      .addEventListener("click", () =>
        handleSimpleGeneration("UUID", Uuid.generate, "resultado-uuid")
      );
    document
      .getElementById("gerar-lorem")
      .addEventListener("click", () =>
        handleSimpleGeneration(
          "Lorem Ipsum",
          () =>
            Lorem.generate(document.getElementById("lorem-paragrafos").value),
          "resultado-lorem",
          true
        )
      );

    document
      .getElementById("gerar-qrcode")
      .addEventListener("click", () =>
        QrCodeGenerator.generate(
          document.getElementById("qrcode-texto").value,
          "resultado-qrcode"
        )
      );
    document
      .getElementById("base64-codificar")
      .addEventListener("click", () => {
        const text = document.getElementById("base64-input").value;
        renderResult("resultado-base64", Base64.encode(text), true);
        AppState.addToHistory("Base64 (Codificado)", text);
      });
    document
      .getElementById("base64-decodificar")
      .addEventListener("click", () => {
        const text = document.getElementById("base64-input").value;
        renderResult("resultado-base64", Base64.decode(text), true);
        AppState.addToHistory("Base64 (Decodificado)", text);
      });

    document.getElementById("contador-input").addEventListener("input", (e) => {
      const stats = Contador.count(e.target.value);
      document.querySelector(
        "#resultado-contador span"
      ).textContent = `Caracteres: ${stats.caracteres} | Palavras: ${stats.palavras} | Linhas: ${stats.linhas}`;
    });

    const convertPdfBtn = document.getElementById("convert-pdf");
    convertPdfBtn.addEventListener("click", () => {
      const fileInput = document.getElementById("image-input");
      if (fileInput.files.length > 0) {
        showSpinner(convertPdfBtn);
        setTimeout(
          () =>
            ImageToPdf.convert(fileInput.files[0], "resultado-pdf", () =>
              hideSpinner(convertPdfBtn)
            ),
          50
        );
      } else {
        renderResult(
          "resultado-pdf",
          "Por favor, selecione um arquivo primeiro."
        );
      }
    });
    const analyzeVideoBtn = document.getElementById("analyze-video");
    analyzeVideoBtn.addEventListener("click", () => {
      const fileInput = document.getElementById("video-input");
      if (fileInput.files.length > 0) {
        showSpinner(analyzeVideoBtn);
        setTimeout(
          () =>
            VideoInfo.analyze(fileInput.files[0], "resultado-video-info", () =>
              hideSpinner(analyzeVideoBtn)
            ),
          50
        );
      } else {
        renderResult(
          "resultado-video-info",
          "Por favor, selecione um arquivo primeiro."
        );
      }
    });

    const jwtInput = document.getElementById("jwt-input");
    jwtInput.addEventListener("input", () => {
      const token = jwtInput.value;
      const resultBox = document.getElementById("resultado-jwt");
      if (!token) {
        renderResult("resultado-jwt", "Aguardando um token...");
        return;
      }
      const result = JwtDebugger.decode(token);
      if (result.error) {
        renderResult("resultado-jwt", result.error);
        resultBox.querySelector("span").classList.add("jwt-error");
      } else {
        let html = `<div class="jwt-part"><h4 class="jwt-part-title">Header</h4><pre class="jwt-part-content">${JSON.stringify(
          result.header,
          null,
          2
        )}</pre></div><div class="jwt-part"><h4 class="jwt-part-title">Payload</h4><pre class="jwt-part-content">${JSON.stringify(
          result.payload,
          null,
          2
        )}</pre></div>`;
        if (result.extra) {
          html += `<div class="jwt-part"><h4 class="jwt-part-title">Verificação</h4><pre class="jwt-part-content">Expiração: ${
            result.extra.expiracao
          }\nStatus: <span class="jwt-status ${result.extra.status.toLowerCase()}">${
            result.extra.status
          }</span></pre></div>`;
        }
        resultBox.innerHTML = html;
        AppState.addToHistory("JWT Decodificado", token);
      }
    });

    const regexPattern = document.getElementById("regex-pattern"),
      regexFlags = document.getElementById("regex-flags"),
      regexTestString = document.getElementById("regex-test-string");
    function runRegexTest() {
      const result = RegexTester.test(
        regexPattern.value,
        regexFlags.value,
        regexTestString.value
      );
      const highlightBox = document.getElementById("resultado-regex-highlight"),
        matchesBox = document.getElementById("resultado-regex-matches");
      if (result.error) {
        highlightBox.innerHTML = `<span class="jwt-error">${result.error}</span>`;
        matchesBox.textContent = "Erro na expressão.";
      } else {
        highlightBox.innerHTML =
          result.highlightedHtml || "<span>Aguardando texto...</span>";
        matchesBox.textContent = `Correspondências: ${
          result.matchCount
        }\n\n${result.matches.slice(0, 100).join("\n")}`;
      }
    }
    regexPattern.addEventListener("input", runRegexTest);
    regexFlags.addEventListener("input", runRegexTest);
    regexTestString.addEventListener("input", runRegexTest);

    document.getElementById("url-encode-btn").addEventListener("click", () => {
      const input = document.getElementById("url-encoder-input").value;
      renderResult("resultado-url-encoder", UrlEncoder.encode(input), true);
      AppState.addToHistory("URL (Codificado)", input);
    });
    document.getElementById("url-decode-btn").addEventListener("click", () => {
      const input = document.getElementById("url-encoder-input").value;
      renderResult("resultado-url-encoder", UrlEncoder.decode(input), true);
      AppState.addToHistory("URL (Decodificado)", input);
    });

    const cronInput = document.getElementById("cron-input");
    function runCronParser() {
      const expression = cronInput.value;
      const descResultBox = document.getElementById("resultado-cron-desc"),
        nextResultBox = document.getElementById("resultado-cron-next");
      const parsed = CronParser.parse(expression);
      if (parsed.error) {
        descResultBox.innerHTML = `<span class="jwt-error">${parsed.error}</span>`;
        nextResultBox.innerHTML = "<span>Inválido</span>";
      } else {
        renderResult("resultado-cron-desc", parsed.description);
        const nextExecutions = CronParser.getNextExecutions(expression);
        const nextDatesString =
          nextExecutions.length > 0
            ? "Próximas 5 execuções:\n" +
              nextExecutions
                .map((date) => date.toLocaleString("pt-BR"))
                .join("\n")
            : "Não foi possível calcular as próximas execuções.";
        renderResult("resultado-cron-next", nextDatesString, true);
        if (expression.trim().split(/\s+/).length === 5)
          AppState.addToHistory("Expressão Cron", expression);
      }
    }
    cronInput.addEventListener("input", runCronParser);
    if (cronInput.value) runCronParser();

    document.getElementById("format-code-btn").addEventListener("click", () => {
      const language = document.getElementById("code-language-select").value;
      const code = document.getElementById("code-input").value;
      showSpinner(document.getElementById("format-code-btn"));
      setTimeout(() => {
        const result = CodeFormatter.format(code, language);
        if (result.error) {
          renderResult("resultado-code-formatter", result.error);
          document
            .querySelector("#resultado-code-formatter span")
            .classList.add("jwt-error");
        } else {
          renderResult("resultado-code-formatter", result.formattedCode, true);
          AppState.addToHistory(
            `Código ${language.toUpperCase()} Formatado`,
            "...",
            false
          );
        }
        hideSpinner(document.getElementById("format-code-btn"));
      }, 50);
    });

    document
      .getElementById("generate-hash-btn")
      .addEventListener("click", () => {
        const text = document.getElementById("hash-input").value;
        const algo = document.getElementById("hash-algorithm-select").value;
        const hash = HashGenerator.generate(text, algo);
        renderResult("resultado-hash", hash, true);
        AppState.addToHistory(`Hash ${algo}`, text);
      });

    const humanDateInput = document.getElementById("human-date-input");
    const timestampInput = document.getElementById("timestamp-input");
    const utcResultBox = document.getElementById("resultado-timestamp-utc");
    humanDateInput.addEventListener("input", () => {
      const ts = TimestampConverter.toTimestamp(humanDateInput.value);
      timestampInput.value = ts;
      if (ts)
        utcResultBox.textContent = `UTC: ${new Date(ts * 1000).toUTCString()}`;
    });
    timestampInput.addEventListener("input", () => {
      const dateStr = TimestampConverter.fromTimestamp(timestampInput.value);
      humanDateInput.value = dateStr;
      if (dateStr)
        utcResultBox.textContent = `UTC: ${new Date(
          parseInt(timestampInput.value) * 1000
        ).toUTCString()}`;
    });
    document
      .getElementById("timestamp-now-btn")
      .addEventListener("click", () => {
        const nowTs = TimestampConverter.now();
        timestampInput.value = nowTs;
        timestampInput.dispatchEvent(new Event("input"));
      });

    const colorPicker = document.getElementById("color-picker-input");
    const hexInput = document.getElementById("hex-color-input");
    const rgbInput = document.getElementById("rgb-color-input");
    const swatchBox = document.getElementById("resultado-color-swatch");
    function updateColors(source, value) {
      let r, g, b, hex;
      if (source === "picker" || source === "hex") {
        hex = value;
        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) return;
        const rgbArr = ColorConverter.parseRgbString(
          ColorConverter.hexToRgb(hex)
        );
        if (!rgbArr) return;
        [r, g, b] = rgbArr;
      } else if (source === "rgb") {
        const rgbArr = ColorConverter.parseRgbString(value);
        if (!rgbArr || rgbArr.some((c) => c > 255)) return;
        [r, g, b] = rgbArr;
        hex = ColorConverter.rgbToHex(r, g, b);
      } else {
        return;
      }
      if (source !== "picker") colorPicker.value = hex;
      if (source !== "hex") hexInput.value = hex;
      if (source !== "rgb") rgbInput.value = `rgb(${r}, ${g}, ${b})`;
      const hsl = ColorConverter.rgbToHsl(r, g, b);
      swatchBox.style.backgroundColor = hex;
      swatchBox.innerHTML = `<div class="color-value">${hex}</div><div class="color-value">rgb(${r}, ${g}, ${b})</div><div class="color-value">${hsl}</div>`;
    }
    colorPicker.addEventListener("input", (e) =>
      updateColors("picker", e.target.value)
    );
    hexInput.addEventListener("input", (e) =>
      updateColors("hex", e.target.value)
    );
    rgbInput.addEventListener("input", (e) =>
      updateColors("rgb", e.target.value)
    );
    updateColors("picker", colorPicker.value);

    document
      .getElementById("historico-content")
      .addEventListener("click", (e) => {
        const copyBtn = e.target.closest("[data-history-copy-index]");
        const addBtn = e.target.closest("[data-history-add-index]");
        if (copyBtn) {
          const item =
            AppState.history[parseInt(copyBtn.dataset.historyCopyIndex, 10)];
          const contentToCopy =
            typeof item.data === "object"
              ? Object.entries(item.data)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join("\n")
              : item.data;
          copyToClipboard(contentToCopy, copyBtn);
        }
        if (addBtn) {
          const item =
            AppState.history[parseInt(addBtn.dataset.historyAddIndex, 10)];
          AppState.lastGeneratedData[item.type.toLowerCase()] = item.data;
          addToScenario(item.type.toLowerCase());
        }
      });

    document.querySelectorAll(".explanation-toggle").forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        const content = document.getElementById(e.target.dataset.target);
        if (content) {
          e.target.classList.toggle("active");
          const isVisible =
            content.style.maxHeight && content.style.maxHeight !== "0px";
          content.style.maxHeight = isVisible
            ? "0px"
            : content.scrollHeight + "px";
        }
      });
    });
  }
