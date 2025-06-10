const Pessoa = {
    nomesMasculinos: ["Lucas", "Miguel", "Arthur", "Heitor", "Theo", "Davi", "Gabriel", "Bernardo", "Samuel", "João"],
    nomesFemininos: ["Alice", "Sophia", "Helena", "Valentina", "Laura", "Isabella", "Manuela", "Júlia", "Heloísa", "Luiza"],
    sobrenomes: ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes"],
    randItem: (arr) => arr[Math.floor(Math.random() * arr.length)],
    geraDataNascimento: (idade) => {
        const hoje = new Date();
        const anoNascimento = hoje.getFullYear() - idade;
        const mesNascimento = Math.floor(Math.random() * 12);
        const diaMaximo = new Date(anoNascimento, mesNascimento + 1, 0).getDate();
        const diaNascimento = Math.floor(Math.random() * diaMaximo) + 1;
        const data = new Date(anoNascimento, mesNascimento, diaNascimento);
        return data.toLocaleDateString('pt-BR');
    },
    generate: (idade) => {
        const sexo = Math.random() > 0.5 ? 'Masculino' : 'Feminino';
        const nome = sexo === 'Masculino' ? Pessoa.randItem(Pessoa.nomesMasculinos) : Pessoa.randItem(Pessoa.nomesFemininos);
        const sobrenome1 = Pessoa.randItem(Pessoa.sobrenomes);
        const sobrenome2 = Pessoa.randItem(Pessoa.sobrenomes);
        const nomeCompleto = `${nome} ${sobrenome1} ${sobrenome2}`;
        return {
            "Nome": nomeCompleto,
            "CPF": Cpf.generate(true),
            "Nascimento": Pessoa.geraDataNascimento(idade),
            "Idade": `${idade} anos`,
        };
    }
};