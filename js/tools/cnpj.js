export const Cnpj = {
    // Funções base para gerar o número do CNPJ
    rand: (min = 0, max = 9) => Math.floor(Math.random() * (max - min + 1)) + min,
    geraDigito: function(n) {
        let i = n.length - 7;
        const resto = n.reduce((total, el) => {
            const res = total + el * i--;
            if (i < 2) i = 9;
            return res;
        }, 0) % 11;
        return resto < 2 ? 0 : 11 - resto;
    },
    format: (cnpj) => cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'),

    // Fontes de dados para gerar informações da empresa
    nomes_fantasia: ["Alpha", "Orion", "Sirius", "Vega", "Delta", "Nexus", "Quantum", "Matrix", "Apex", "Vertex"],
    segmentos: ["Soluções Digitais", "Sistemas", "Consultoria", "Engenharia", "Construções", "Logística", "Tech", "Inovações", "Comércio", "Serviços"],
    sufixos: ["LTDA", "ME", "EIRELI", "S.A.", "EPP"],
    atividades_principais: [
        "47.81-4-00 - Comércio varejista de artigos do vestuário e acessórios",
        "73.19-0-03 - Marketing direto",
        "62.01-5-01 - Desenvolvimento de programas de computador sob encomenda",
        "82.19-9-99 - Preparação de documentos e serviços especializados de apoio administrativo",
        "41.20-4-00 - Construção de edifícios"
    ],
    tipos_logradouro: ["Rua", "Avenida", "Praça", "Travessa"],
    nomes_logradouro: ["das Flores", "Brasil", "da Paz", "dos Girassóis", "das Acácias", "Principal", "XV de Novembro"],
    bairros: ["Centro", "Vila Nova", "Jardim das Américas", "Santa Mônica", "Boa Vista", "Portão"],
    cidades: [
        { cidade: "São Paulo", uf: "SP" },
        { cidade: "Rio de Janeiro", uf: "RJ" },
        { cidade: "Belo Horizonte", uf: "MG" },
        { cidade: "Curitiba", uf: "PR" },
        { cidade: "Porto Alegre", uf: "RS" }
    ],

    randItem: (arr) => arr[Math.floor(Math.random() * arr.length)],

    generate: function(comPontos = true) {
        const n = Array.from({ length: 8 }, () => this.rand());
        n.push(0, 0, 0, 1);
        n.push(this.geraDigito([...n]));
        n.push(this.geraDigito([...n]));
        const cnpjString = n.join('');

        const nomeFantasia = `${this.randItem(this.nomes_fantasia)} ${this.randItem(this.segmentos)}`;
        const razaoSocial = `${nomeFantasia} ${this.randItem(this.sufixos)}`;
        const cidadeInfo = this.randItem(this.cidades);
        const dataAbertura = new Date(Date.now() - Math.random() * 3e11).toLocaleDateString('pt-BR');

        const dadosEmpresa = {
            "CNPJ": comPontos ? this.format(cnpjString) : cnpjString,
            "Razão Social": razaoSocial,
            "Nome Fantasia": nomeFantasia,
            "Data de Abertura": dataAbertura,
            "Situação Cadastral": "ATIVA",
            "Endereço": `${this.randItem(this.tipos_logradouro)} ${this.randItem(this.nomes_logradouro)}, ${this.rand(10, 2000)}`,
            "Bairro": this.randItem(this.bairros),
            "Município/UF": `${cidadeInfo.cidade}/${cidadeInfo.uf}`,
            "CEP": `${this.rand(10000, 99999)}-${this.rand(100,999)}`,
            "Telefone": `(${this.rand(11, 99)}) ${this.rand(3000, 5000)}-${this.rand(1000,9999)}`,
            "E-mail": `${nomeFantasia.toLowerCase().replace(/\s/g,'.')}@emailficticio.com`,
            "Atividade Principal": this.randItem(this.atividades_principais)
        };
        
        return dadosEmpresa;
    }
};