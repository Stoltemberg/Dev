import { Cpf } from './cpf.js'; // Importamos a lógica do CPF para usá-la aqui

export const PessoaGenerator = {
    nomesMasculinos: ["Lucas", "Miguel", "Arthur", "Heitor", "Theo", "Davi", "Gabriel", "Bernardo", "Samuel", "João", "Rafael", "Enzo", "Nicolas", "Matheus", "Guilherme"],
    nomesFemininos: ["Alice", "Sophia", "Helena", "Valentina", "Laura", "Isabella", "Manuela", "Júlia", "Heloísa", "Luiza", "Maria", "Cecília", "Lívia", "Beatriz", "Mariana"],
    sobrenomes: ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Ribeiro", "Martins", "Carvalho", "Almeida", "Melo"],
    cidadesPorUF: {
        'SP': ['São Paulo', 'Guarulhos', 'Campinas', 'Osasco', 'Ribeirão Preto'],
        'RJ': ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói'],
        'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'],
        'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari'],
        'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
        'RS': ['Porto Alegre', 'Caxias do Sul', 'Canoas', 'Pelotas', 'Santa Maria']
    },
    
    randItem: (arr) => arr[Math.floor(Math.random() * arr.length)],
    randRange: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    // Gera um único perfil de pessoa com base nas opções
    generateSingle: function(options = {}) {
        const { gender = 'aleatorio', uf = '' } = options;
        const finalGender = gender === 'aleatorio' ? (Math.random() > 0.5 ? 'masculino' : 'feminino') : gender;
        
        const nome = finalGender === 'masculino' ? this.randItem(this.nomesMasculinos) : this.randItem(this.nomesFemininos);
        const nomeCompleto = `${nome} ${this.randItem(this.sobrenomes)} ${this.randItem(this.sobrenomes)}`;
        
        const idade = this.randRange(18, 70);
        const dataNascimento = new Date(new Date().getFullYear() - idade, this.randRange(0, 11), this.randRange(1, 28)).toLocaleDateString('pt-BR');
        
        const ufsDisponiveis = Object.keys(this.cidadesPorUF);
        const estadoFinal = uf && this.cidadesPorUF[uf] ? uf : this.randItem(ufsDisponiveis);
        const cidade = this.randItem(this.cidadesPorUF[estadoFinal]);

        return {
            Nome: nomeCompleto,
            CPF: Cpf.generate(true),
            Idade: idade,
            Nascimento: dataNascimento,
            Endereco: `${cidade} - ${estadoFinal}`
        };
    },

    // Gera uma lista de pessoas
    generate: function(options = {}) {
        const { count = 1 } = options;
        const people = [];
        for (let i = 0; i < count; i++) {
            people.push(this.generateSingle(options));
        }
        return people;
    }
};