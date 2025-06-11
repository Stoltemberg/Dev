const TimestampConverter = {
    toTimestamp: function(dateString) {
        if (!dateString) return '';
        try {
            // Converte a data local para um timestamp Unix em segundos
            const date = new Date(dateString);
            return Math.floor(date.getTime() / 1000);
        } catch (e) {
            return 'Data inválida';
        }
    },

    fromTimestamp: function(timestamp) {
        if (!timestamp) return '';
        const tsNumber = Number(timestamp);
        if (isNaN(tsNumber)) return 'Timestamp inválido';
        
        // Converte o timestamp Unix (em segundos) para uma data local
        const date = new Date(tsNumber * 1000);
        // Formata para o padrão de input datetime-local (YYYY-MM-DDTHH:mm)
        const pad = (num) => num.toString().padStart(2, '0');
        const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        return formattedDate;
    },
    
    now: function() {
        return Math.floor(Date.now() / 1000);
    }
};