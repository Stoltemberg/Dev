const Cartao = {
    nomes: ["Maria R.", "Joao P.", "Ana C.", "Pedro H.", "Sofia G.", "Carlos E.", "Laura M.", "Marcos A."],
    sobrenomes: ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira"],

    // Gera um nome aleatório para o titular
    geraNome: function() {
        const nome = this.nomes[Math.floor(Math.random() * this.nomes.length)];
        const sobrenome = this.sobrenomes[Math.floor(Math.random() * this.sobrenomes.length)];
        return `${nome} ${sobrenome}`.toUpperCase();
    },

    // Gera uma data de validade futura (entre 2 e 6 anos a partir de hoje)
    geraValidade: function() {
        const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const anoAtual = new Date().getFullYear();
        const anoFuturo = anoAtual + Math.floor(Math.random() * 5) + 2;
        return `${mes}/${anoFuturo}`;
    },

    // Gera um código de segurança (CVV) de 3 dígitos
    geraCvv: function() {
        return String(Math.floor(Math.random() * 900) + 100);
    },

    // Função principal que gera todos os dados do cartão
    generate: function(bandeira) {
        const prefixes = {
            visa: ['4'],
            mastercard: ['51', '52', '53', '54', '55']
        };

        const prefix = prefixes[bandeira][Math.floor(Math.random() * prefixes[bandeira].length)];
        const length = 16;
        let cardNumber = prefix;
        
        while (cardNumber.length < length - 1) {
            cardNumber += Math.floor(Math.random() * 10);
        }

        // Algoritmo de Luhn para o dígito de verificação
        let sum = 0;
        let shouldDouble = true;
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        const checkDigit = (10 - (sum % 10)) % 10;
        cardNumber += checkDigit;
        
        // Retorna um objeto com todos os dados
        return {
            numero: cardNumber.replace(/(\d{4})/g, '$1 ').trim(),
            nome: this.geraNome(),
            validade: this.geraValidade(),
            cvv: this.geraCvv()
        };
    }
};