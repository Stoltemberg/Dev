import { TimestampConverter } from '../tools/timestamp_converter.js';
import { formatTimeAgo, addToHistory } from '../shared/workspace-logic.js';

export function initTimestampConverterPage() {
    // Elementos da UI
    const tsToDateInput = document.getElementById('ts-to-date-input');
    const convertTsToDateBtn = document.getElementById('convert-ts-to-date-btn');
    const dateOutputGroup = document.getElementById('date-output-group');
    const outputLocalDate = document.getElementById('output-local-date');
    const outputUtcDate = document.getElementById('output-utc-date');
    const outputRelativeDate = document.getElementById('output-relative-date');

    const dateToTsInput = document.getElementById('date-to-ts-input');
    const convertDateToTsBtn = document.getElementById('convert-date-to-ts-btn');
    const timestampOutputGroup = document.getElementById('timestamp-output-group');
    const nowBtn = document.getElementById('timestamp-now-btn');

    // Listener para o primeiro conversor: Timestamp -> Data
    convertTsToDateBtn.addEventListener('click', () => {
        const unit = document.querySelector('input[name="ts-unit"]:checked').value;
        const date = TimestampConverter.fromTimestamp(tsToDateInput.value, unit);

        if (date) {
            dateOutputGroup.style.visibility = 'visible';
            outputLocalDate.textContent = date.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'medium' });
            outputUtcDate.textContent = date.toUTCString();
            outputRelativeDate.textContent = formatTimeAgo(date);
            addToHistory(`Timestamp Convertido`, tsToDateInput.value, false);
        } else {
            dateOutputGroup.style.visibility = 'hidden';
            alert("Timestamp inserido é inválido.");
        }
    });

    // Listener para o segundo conversor: Data -> Timestamp
    convertDateToTsBtn.addEventListener('click', () => {
        const dateString = dateToTsInput.value;
        const tsSeconds = TimestampConverter.toTimestamp(dateString, 's');
        const tsMillis = TimestampConverter.toTimestamp(dateString, 'ms');

        if (tsSeconds !== null && tsSeconds !== '') {
            timestampOutputGroup.innerHTML = `<pre>Segundos:      ${tsSeconds}\nMilissegundos: ${tsMillis}</pre>`;
            timestampOutputGroup.classList.add('has-content');
            addToHistory(`Data Convertida`, dateString, false);
        } else {
            timestampOutputGroup.innerHTML = '<span>Data inválida.</span>';
            timestampOutputGroup.classList.remove('has-content');
        }
    });
    
    // Listener para o botão "Agora"
    nowBtn.addEventListener('click', () => {
        const now = new Date();
        dateToTsInput.value = TimestampConverter.formatDateToInput(now);
    });
}