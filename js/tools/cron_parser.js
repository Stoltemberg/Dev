export const CronParser = {
    parse: function(cronString) {
        if (!cronString || cronString.trim() === '') {
            return { error: "Expressão vazia." };
        }
        const parts = cronString.trim().split(/\s+/);
        if (parts.length !== 5) {
            return { error: "Uma expressão cron deve ter 5 partes (minuto, hora, dia do mês, mês, dia da semana)." };
        }

        try {
            const [min, hour, dayOfMonth, month, dayOfWeek] = parts;
            const description = [
                this.describePart(min, "minuto", "aos", "minutos"),
                this.describePart(hour, "hora", "às", "horas"),
                this.describePart(dayOfMonth, "dia do mês", "no dia", "nos dias"),
                this.describePart(month, "mês", "em", "em"),
                this.describePart(dayOfWeek, "dia da semana", "no(a)", "nos(as)")
            ].join(', ');
            return { description: `Executa ${description}.` };
        } catch (e) {
            return { error: e.message };
        }
    },

    describePart: function(part, unit, singular, plural) {
        if (/[^0-9*,/-]/.test(part)) throw new Error(`Caractere inválido na parte de ${unit}`);
        if (part === '*') return `a cada ${unit}`;
        
        let description = [];
        const segments = part.split(',');

        for (const segment of segments) {
            if (segment.includes('/')) {
                const [base, step] = segment.split('/');
                if (base === '*') description.push(`a cada ${step} ${unit}s`);
                else description.push(`a cada ${step} ${unit}s, começando de ${base}`);
            } else if (segment.includes('-')) {
                const [start, end] = segment.split('-');
                description.push(`de ${start} a ${end}`);
            } else {
                description.push(segment);
            }
        }
        const prefix = segments.length > 1 || segments[0].includes('-') ? plural : singular;
        return `${prefix} ${description.join(' e ')}`;
    },
    
    getNextExecutions: function(cronString, count = 5) {
        const parts = cronString.trim().split(/\s+/);
        if (parts.length !== 5) return [];

        let executions = [];
        let now = new Date();
        now.setSeconds(0, 0);

        for (let i = 0; i < 60 * 24 * 365; i++) { // Limite de 1 ano de busca
            now.setMinutes(now.getMinutes() + 1);
            
            const [min, hour, dayOfMonth, month, dayOfWeek] = parts;
            
            if (this.match(now.getMinutes(), min) &&
                this.match(now.getHours(), hour) &&
                this.match(now.getDate(), dayOfMonth) &&
                this.match(now.getMonth() + 1, month) &&
                this.match(now.getDay(), dayOfWeek)) {
                executions.push(new Date(now));
                if (executions.length === count) break;
            }
        }
        return executions;
    },

    match: function(value, expression) {
        if (expression === '*') return true;
        const segments = expression.split(',');
        for (const segment of segments) {
            if (segment.includes('/')) {
                const [, step] = segment.split('/');
                if ((value % parseInt(step, 10)) === 0) return true;
            } else if (segment.includes('-')) {
                const [start, end] = segment.split('-').map(Number);
                if (value >= start && value <= end) return true;
            } else {
                if (parseInt(segment, 10) === value) return true;
            }
        }
        return false;
    }
};