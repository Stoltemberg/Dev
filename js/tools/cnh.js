const Cnh = {
    // Função auxiliar para gerar números aleatórios
    rand: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    // Função principal que gera todos os dados da CNH
    generate: function(comFormatacao = true) {
        // Gera os 9 primeiros dígitos aleatoriamente
        const n = Array.from({ length: 9 }, () => this.rand(0, 9));

        // --- Cálculo do Primeiro Dígito Verificador (DV1) ---
        let soma1 = 0;
        let peso = 9;
        for (let i = 0; i < 9; i++) {
            soma1 += n[i] * peso;
            peso--;
        }
        let dv1 = soma1 % 11;
        if (dv1 >= 10) {
            dv1 = 0;
        }
        
        // --- Cálculo do Segundo Dígito Verificador (DV2) ---
        let soma2 = 0;
        peso = 1;
        for (let i = 0; i < 9; i++) {
            soma2 += n[i] * peso;
            peso++;
        }
        let dv2 = soma2 % 11;
        if (dv2 >= 10) {
            dv2 = 0;
        }

        const numeroCnh = `${n.join('')}${dv1}${dv2}`;

        // --- Gera dados adicionais ---
        const categorias = ['A', 'B', 'AB', 'C', 'D', 'E', 'AC', 'AD', 'AE'];
        const categoria = categorias[this.rand(0, categorias.length - 1)];
        const hoje = new Date();

        // Data da primeira habilitação (de 1 a 30 anos atrás)
        const primeiraHab = new Date(hoje.getFullYear() - this.rand(1, 30), this.rand(0, 11), this.rand(1, 28));
        
        // Data de validade (de 3 a 10 anos no futuro)
        const validade = new Date(hoje.getFullYear() + this.rand(3, 10), this.rand(0, 11), this.rand(1, 28));

        return {
            "Número de Registro": comFormatacao ? numeroCnh.replace(/(\d{9})(\d{2})/, '$1 $2') : numeroCnh,
            "Categoria": categoria,
            "Validade": validade.toLocaleDateString('pt-BR'),
            "Primeira Habilitação": primeiraHab.toLocaleDateString('pt-BR')
        };
    }
};