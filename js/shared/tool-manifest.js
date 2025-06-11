export const tools = [
    // Categoria: Documentos
    { id: 'pessoa', name: 'Gerador de Pessoas', desc: 'Crie perfis completos com CPF, idade e endereço.', url: 'html/gerador-pessoa.html', category: 'Documentos', tags: ['documento', 'teste', 'massa', 'dados'] },
    { id: 'cpf', name: 'Gerador de CPF', desc: 'Gere números de CPF válidos, únicos ou em massa.', url: 'html/gerador-cpf.html', category: 'Documentos', tags: ['documento', 'teste'] },
    { id: 'cnpj', name: 'Gerador de CNPJ', desc: 'Gere perfis de empresas com CNPJ válido e dados.', url: 'html/gerador-cnpj.html', category: 'Documentos', tags: ['empresa', 'teste'] },
    { id: 'cnh', name: 'Gerador de CNH', desc: 'Gere dados de CNH válidos, com categoria e datas.', url: 'html/gerador-cnh.html', category: 'Documentos', tags: ['documento', 'detran', 'teste'] },
    { id: 'validator', name: 'Validador de Documentos', desc: 'Verifique se um CPF ou CNPJ é matematicamente válido.', url: 'html/validador-docs.html', category: 'Documentos', tags: ['cpf', 'cnpj', 'validar', 'verificar'] },

    // Categoria: Desenvolvimento
    { id: 'senha', name: 'Gerador de Senha', desc: 'Crie senhas fortes e personalizadas para sistemas.', url: 'html/gerador-senha.html', category: 'Desenvolvimento', tags: ['segurança', 'password'] },
    { id: 'cartao', name: 'Gerador de Cartão de Crédito', desc: 'Gere dados completos de cartão para testes de checkout.', url: 'html/gerador-cartao.html', category: 'Desenvolvimento', tags: ['teste', 'pagamento', 'ecommerce'] },
    { id: 'uuid', name: 'Gerador de UUID', desc: 'Gere Identificadores Únicos Universais (v4).', url: 'html/gerador-uuid.html', category: 'Desenvolvimento', tags: ['id', 'banco de dados', 'guid'] },
    { id: 'jwt', name: 'Debugador de JWT', desc: 'Decodifique e analise JSON Web Tokens em tempo real.', url: 'html/jwt-debugger.html', category: 'Desenvolvimento', tags: ['api', 'segurança', 'autenticação', 'token'] },
    { id: 'regex', name: 'Testador de Regex', desc: 'Valide Expressões Regulares de forma interativa.', url: 'html/regex-tester.html', category: 'Desenvolvimento', tags: ['texto', 'validação', 'regexp'] },
    { id: 'url-encoder', name: 'Codificador de URL', desc: 'Codifique/Decodifique texto para uso seguro em URLs.', url: 'html/url-encoder.html', category: 'Desenvolvimento', tags: ['web', 'http', 'encode', 'decode'] },
    { id: 'cron', name: 'Analisador de Cron', desc: 'Traduza expressões Cron e veja as próximas execuções.', url: 'html/cron-parser.html', category: 'Desenvolvimento', tags: ['servidor', 'backend', 'devops', 'job'] },
    
    // Categoria: Web & Texto
    { id: 'lorem', name: 'Gerador de Lorem Ipsum', desc: 'Gere parágrafos de texto aleatório para layouts.', url: 'html/gerador-lorem.html', category: 'Web & Texto', tags: ['design', 'layout', 'placeholder'] },
    { id: 'qrcode', name: 'Gerador de QR Code', desc: 'Converta qualquer texto ou link em uma imagem de QR Code.', url: 'html/qrcode.html', category: 'Web & Texto', tags: ['mobile', 'imagem', 'scan'] },
    { id: 'base64', name: 'Codificador Base64', desc: 'Codifique ou decodifique dados no formato Base64.', url: 'html/base64.html', category: 'Web & Texto', tags: ['encoding', 'dados'] },
    { id: 'contador', name: 'Contador de Texto', desc: 'Contagem de caracteres, palavras e linhas.', url: 'html/contador.html', category: 'Web & Texto', tags: ['escrita', 'utilitário', 'char'] },
    { id: 'code-formatter', name: 'Formatador de Código', desc: 'Embeleze e organize seu código JSON, SQL, HTML e mais.', url: 'html/code-formatter.html', category: 'Web & Texto', tags: ['json', 'sql', 'desenvolvimento', 'pretty', 'html', 'css', 'javascript', 'java'] },

    // Categoria: Utilitários
    { id: 'hash-generator', name: 'Gerador de Hash', desc: 'Calcule hashes (MD5, SHA-256) para qualquer texto.', url: 'html/hash-generator.html', category: 'Utilitários', tags: ['segurança', 'criptografia'] },
    // d: 'timestamp-converter', name: 'Conversor de Timestamp', desc: 'Converta entre datas legíveis e Timestamp Unix.', url: 'html/timestamp-converter.html', category: 'Utilitários', tags: ['data', 'api', 'unix'] },
    { id: 'color-converter', name: 'Conversor de Cores', desc: 'Converta cores entre os formatos HEX, RGB e HSL.', url: 'html/color-converter.html', category: 'Utilitários', tags: ['css', 'design', 'front-end'] },
    { id: 'calculadora', name: 'Calculadora de Porcentagem', desc: 'Cálculos de porcentagem rápidos e fáceis.', url: 'html/calculadora-porcentagem.html', category: 'Utilitários', tags: ['matemática', 'cálculo'] },
    { id: 'img-to-pdf', name: 'Imagem para PDF', desc: 'Converta arquivos de imagem em um documento PDF.', url: 'html/img-to-pdf.html', category: 'Utilitários', tags: ['arquivo', 'conversor'] },
    { id: 'video-info', name: 'Info de Vídeo', desc: 'Extraia metadados como resolução e duração de vídeos.', url: 'html/video-info.html', category: 'Utilitários', tags: ['mídia', 'arquivo'] },
];