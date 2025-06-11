export const Lorem = {
  wordCorpus: [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur', 'vitae',
      'hendrerit', 'dignissim', 'sed', 'erat', 'et', 'nunc', 'aliquam', 'mauris', 'aenean', 'vel', 'libero',
      'praesent', 'quis', 'urna', 'eget', 'eros', 'interdum', 'laoreet', 'donec', 'velit', 'pede',
      'malesuada', 'in', 'imperdiet', 'et', 'venenatis', 'at', 'turpis', 'nullam', 'ultricies',
      'pellentesque', 'auctor', 'semper', 'aliquet', 'nibh', 'varius', 'facilisis', 'maecenas', 'gravida',
      'ullamcorper', 'ligula', 'eu', 'tempor', 'congue', 'est', 'bibendum', 'nec', 'luctus', 'magna',
      'felis', 'sollicitudin', 'integer', 'faucibus', 'accumsan', 'odio', 'nulla', 'pharetra',
      'vestibulum', 'sodales', 'ante', 'ipsum', 'primis', 'in', 'faucibus', 'orci', 'luctus', 'et',
      'ultrices', 'posuere', 'cubilia', 'curae', 'phasellus', 'a', 'tellus', 'mollis', 'placerat',
      'euismod', 'suscipit', 'non', 'sapien', 'nam', 'ac', 'urna', 'rhoncus', 'eleifend', 'quam',
      'quis', 'lectus', 'morbi', 'eget', 'neque', 'ut', 'tellus', 'elementum', 'vulputate', 'duis',
      'ornare', 'lectus', 'id', 'nisl', 'vivamus', 'rhoncus', 'consequat', 'purus'
  ],
  
  randItem: (arr) => arr[Math.floor(Math.random() * arr.length)],
  randRange: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  generateSentence: function() {
      const sentenceLength = this.randRange(8, 20);
      let words = [];
      for (let i = 0; i < sentenceLength; i++) {
          words.push(this.randItem(this.wordCorpus));
      }
      for (let i = 0; i < words.length - 2; i++) {
          if (Math.random() < 0.15) words[i] += ',';
      }
      let sentence = words.join(' ');
      return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  },

  generateParagraph: function() {
      const paragraphLength = this.randRange(4, 7);
      let sentences = [];
      for (let i = 0; i < paragraphLength; i++) {
          sentences.push(this.generateSentence());
      }
      return sentences.join(' ');
  },

  generate: function(options = {}) {
      const {
          type = 'paragraphs',
          count = 3,
          startWithLorem = true,
          wrapInPTags = false
      } = options;

      const numCount = parseInt(count, 10) || 1;
      
      switch (type) {
          case 'words':
              let words = [];
              for (let i = 0; i < numCount; i++) {
                  words.push(this.randItem(this.wordCorpus));
              }
              let wordResult = words.join(' ');
              return startWithLorem ? 'Lorem ipsum ' + wordResult : wordResult;

          case 'sentences':
              let sentences = [];
              for (let i = 0; i < numCount; i++) {
                  sentences.push(this.generateSentence());
              }
              let sentenceResult = sentences.join(' ');
              return startWithLorem ? 'Lorem ipsum dolor sit amet. ' + sentenceResult : sentenceResult;

          case 'paragraphs':
          default:
              let paragraphs = [];
              for (let i = 0; i < numCount; i++) {
                  paragraphs.push(this.generateParagraph());
              }
              if (startWithLorem && paragraphs.length > 0) {
                  paragraphs[0] = 'Lorem ipsum dolor sit amet, ' + paragraphs[0].charAt(0).toLowerCase() + paragraphs[0].slice(1);
              }
              if (wrapInPTags) {
                  return paragraphs.map(p => `<p>${p}</p>`).join('\n\n');
              }
              return paragraphs.join('\n\n');
      }
  }
};