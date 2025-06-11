export const Senha = {
    generate: (length, useMaiusculas, useMinusculas, useNumeros, useSimbolos) => {
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let charSet = '';
        if (useMaiusculas) charSet += upper;
        if (useMinusculas) charSet += lower;
        if (useNumeros) charSet += numbers;
        if (useSimbolos) charSet += symbols;

        if (charSet === '') return 'Selecione ao menos um tipo de caractere.';
        
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charSet.length);
            password += charSet[randomIndex];
        }
        return password;
    }
};