document.addEventListener('DOMContentLoaded', () => {
    // Acessa a lógica através do objeto global
    const { TimestampConverter } = window.NextDevs;
    if (!TimestampConverter) {
        console.error("Lógica do Conversor de Timestamp não encontrada.");
        return;
    }

    const tsToDateInput = document.getElementById('ts-to-date-input');
    const dateToTsInput = document.getElementById('date-to-ts-input');
    const unitRadios = document.querySelectorAll('input[name="ts-unit"]');
    const nowBtn = document.getElementById('timestamp-now-btn');
    const liveTimestampValue = document.getElementById('live-timestamp-value');
    const dateOutputGroup = document.getElementById('date-output-group');
    const outputLocalDate = document.getElementById('output-local-date');
    const outputUtcDate = document.getElementById('output-utc-date');
    const outputRelativeDate = document.getElementById('output-relative-date');
    const timestampOutputGroup = document.getElementById('timestamp-output-group');

    let isUpdating = false;

    function formatTimeAgo(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        if (seconds < 2) return "agora mesmo";
        if (seconds < 60) return `${seconds} seg atrás`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min atrás`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h atrás`;
        const days = Math.floor(hours / 24);
        return `${days}d atrás`;
    }
    
    function convertTsToDate() {
        if (isUpdating) return;
        const unit = document.querySelector('input[name="ts-unit"]:checked').value;
        const date = TimestampConverter.fromTimestamp(tsToDateInput.value, unit);
        
        isUpdating = true;
        if (date) {
            dateOutputGroup.style.display = 'block';
            outputLocalDate.textContent = date.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'medium' });
            outputUtcDate.textContent = date.toUTCString();
            outputRelativeDate.textContent = formatTimeAgo(date);
            dateToTsInput.value = TimestampConverter.formatDateToInput(date);
            convertDateToTs(true);
        } else {
            dateOutputGroup.style.display = 'none';
        }
        isUpdating = false;
    }

    function convertDateToTs(fromSync = false) {
        if (isUpdating && !fromSync) return;
        const tsSeconds = TimestampConverter.toTimestamp(dateToTsInput.value, 's');
        const tsMillis = TimestampConverter.toTimestamp(dateToTsInput.value, 'ms');
        
        if (tsSeconds !== '') {
            timestampOutputGroup.innerHTML = `<pre>Segundos:      ${tsSeconds}\nMilissegundos: ${tsMillis}</pre>`;
        } else {
            timestampOutputGroup.innerHTML = '<span>Aguardando data...</span>';
        }

        if (!fromSync) {
            isUpdating = true;
            tsToDateInput.value = tsSeconds;
            convertTsToDate();
            isUpdating = false;
        }
    }

    tsToDateInput.addEventListener('input', convertTsToDate);
    unitRadios.forEach(radio => radio.addEventListener('change', convertTsToDate));
    dateToTsInput.addEventListener('input', () => convertDateToTs(false));

    nowBtn.addEventListener('click', () => {
        const now = new Date();
        dateToTsInput.value = TimestampConverter.formatDateToInput(now);
        dateToTsInput.dispatchEvent(new Event('input'));
    });

    setInterval(() => {
        liveTimestampValue.textContent = TimestampConverter.now('s');
    }, 1000);
    
    // Define um valor inicial para os campos
    nowBtn.click();
});