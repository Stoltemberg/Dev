export const TimestampConverter = {
    toTimestamp: function(dateString) {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date.getTime();
    },
    fromTimestamp: function(timestamp, unit = 's') {
        if (timestamp === null || String(timestamp).trim() === '') return null;
        const tsNumber = Number(timestamp);
        if (isNaN(tsNumber)) return null;
        const date = new Date(unit === 's' ? tsNumber * 1000 : tsNumber);
        return isNaN(date.getTime()) ? null : date;
    },
    formatDateToInput(date) {
        if (!date || isNaN(date.getTime())) return '';
        const pad = (num) => num.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    now: function() {
        return Date.now();
    }
};