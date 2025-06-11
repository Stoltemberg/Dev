import { PessoaGenerator } from '../tools/pessoa.js';
import { addToHistory } from '../shared/workspace-logic.js';
import { Cpf } from '../tools/cpf.js'; // Precisamos importar para que a lógica de pessoa funcione

document.addEventListener('DOMContentLoaded', () => {
    const gerarBtn = document.getElementById('gerar-pessoas');
    const quantidadeInput = document.getElementById('pessoa-quantidade');
    const generoInput = document.getElementById('pessoa-genero');
    const ufInput = document.getElementById('pessoa-uf');
    const resultContainer = document.getElementById('resultado-pessoa-tabela');
    const exportContainer = document.getElementById('export-buttons');
    const exportCsvBtn = document.getElementById('export-csv');
    const exportJsonBtn = document.getElementById('export-json');

    let generatedData = [];

    function renderTable(people) {
        if (!people || people.length === 0) {
            resultContainer.innerHTML = '<p class="empty-state">Nenhum dado gerado.</p>';
            return;
        }

        const headers = Object.keys(people[0]);
        const table = document.createElement('table');
        table.className = 'pessoa-results-table';

        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        const tbody = table.createTBody();
        people.forEach(person => {
            const row = tbody.insertRow();
            headers.forEach(header => {
                const cell = row.insertCell();
                cell.textContent = person[header];
            });
        });

        resultContainer.innerHTML = '';
        resultContainer.appendChild(table);
        exportContainer.style.display = 'flex';
    }

    function downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    gerarBtn.addEventListener('click', () => {
        const options = {
            count: parseInt(quantidadeInput.value, 10) || 1,
            gender: generoInput.value,
            uf: ufInput.value
        };
        generatedData = PessoaGenerator.generate(options);
        renderTable(generatedData);
        addToHistory(`${options.count} Pessoas Geradas`, 'Dados exibidos na tabela.', true);
    });

    exportJsonBtn.addEventListener('click', () => {
        if (generatedData.length === 0) {
            alert("Gere os dados primeiro antes de exportar.");
            return;
        }
        downloadFile(JSON.stringify(generatedData, null, 2), 'pessoas.json', 'application/json');
    });

    exportCsvBtn.addEventListener('click', () => {
        if (generatedData.length === 0) {
            alert("Gere os dados primeiro antes de exportar.");
            return;
        }
        const headers = Object.keys(generatedData[0]);
        let csvContent = headers.join(',') + '\n';
        generatedData.forEach(row => {
            const values = headers.map(header => `"${String(row[header]).replace(/"/g, '""')}"`);
            csvContent += values.join(',') + '\n';
        });
        downloadFile(csvContent, 'pessoas.csv', 'text/csv;charset=utf-8;');
    });
});