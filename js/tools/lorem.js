const Lorem = {
  // Um vocabulário expandido de palavras pseudo-latinas.
  wordCorpus: [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "curabitur",
    "vitae",
    "hendrerit",
    "dignissim",
    "sed",
    "erat",
    "et",
    "nunc",
    "aliquam",
    "mauris",
    "aenean",
    "vel",
    "libero",
    "praesent",
    "quis",
    "urna",
    "eget",
    "eros",
    "interdum",
    "laoreet",
    "donec",
    "velit",
    "pede",
    "malesuada",
    "in",
    "imperdiet",
    "et",
    "venenatis",
    "at",
    "turpis",
    "nullam",
    "ultricies",
    "pellentesque",
    "auctor",
    "semper",
    "aliquet",
    "nibh",
    "varius",
    "facilisis",
    "maecenas",
    "gravida",
    "ullamcorper",
    "ligula",
    "eu",
    "tempor",
    "congue",
    "est",
    "bibendum",
    "nec",
    "luctus",
    "magna",
    "felis",
    "sollicitudin",
    "integer",
    "faucibus",
    "accumsan",
    "odio",
    "nulla",
    "pharetra",
    "vestibulum",
    "sodales",
    "ante",
    "ipsum",
    "primis",
    "in",
    "faucibus",
    "orci",
    "luctus",
    "et",
    "ultrices",
    "posuere",
    "cubilia",
    "curae",
    "phasellus",
    "a",
    "tellus",
    "mollis",
    "placerat",
    "euismod",
    "suscipit",
    "non",
    "sapien",
    "nam",
    "ac",
    "urna",
    "rhoncus",
    "eleifend",
    "quam",
    "quis",
    "lectus",
    "morbi",
    "eget",
    "neque",
    "ut",
    "tellus",
    "elementum",
    "vulputate",
    "duis",
    "ornare",
    "lectus",
    "id",
    "nisl",
    "vivamus",
    "rhoncus",
    "consequat",
    "purus",
  ],

  // Função para pegar um item aleatório de uma lista.
  randItem: function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // Gera um número aleatório dentro de um intervalo.
  randRange: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Gera uma sentença aleatória.
  generateSentence: function () {
    const sentenceLength = this.randRange(8, 20); // Sentenças terão entre 8 e 20 palavras.
    let words = [];
    for (let i = 0; i < sentenceLength; i++) {
      words.push(this.randItem(this.wordCorpus));
    }

    // Adiciona vírgulas de forma aleatória para mais naturalidade.
    for (let i = 0; i < words.length - 2; i++) {
      if (Math.random() < 0.15) {
        // 15% de chance de adicionar uma vírgula.
        words[i] += ",";
      }
    }

    let sentence = words.join(" ");

    // Começa com letra maiúscula e termina com um ponto.
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
    return sentence;
  },

  // Gera um parágrafo aleatório.
  generateParagraph: function () {
    const paragraphLength = this.randRange(4, 7); // Parágrafos terão entre 4 e 7 sentenças.
    let sentences = [];
    for (let i = 0; i < paragraphLength; i++) {
      sentences.push(this.generateSentence());
    }
    return sentences.join(" ");
  },

  // Função principal que é chamada pelo main.js.
  generate: function (count) {
    // Garante que o count seja um número válido.
    const numParagraphs = parseInt(count, 10) || 1;
    let paragraphs = [];
    for (let i = 0; i < numParagraphs; i++) {
      paragraphs.push(this.generateParagraph());
    }

    // Adiciona "Lorem ipsum dolor sit amet..." no início do primeiro parágrafo por tradição.
    if (paragraphs.length > 0) {
      paragraphs[0] =
        "Lorem ipsum dolor sit amet, " +
        paragraphs[0].charAt(0).toLowerCase() +
        paragraphs[0].slice(1);
    }

    return paragraphs.join("\n\n");
  },
};
