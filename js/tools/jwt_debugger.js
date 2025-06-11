export const JwtDebugger = {
    decode: function(token) {
        if (!token || token.split('.').length < 2) { // JWT pode ter 2 ou 3 partes
            return { error: "Token JWT inválido ou incompleto. Ele deve conter pelo menos duas partes separadas por pontos." };
        }
        try {
            // A biblioteca jwt_decode será importada via CDN no index.html
            const decodedHeader = jwt_decode(token, { header: true });
            const decodedPayload = jwt_decode(token);
            
            const result = {
                header: decodedHeader,
                payload: decodedPayload
            };

            // Adiciona informações de expiração se existirem
            if (decodedPayload.exp) {
                const expirationDate = new Date(decodedPayload.exp * 1000);
                const now = new Date();
                result.extra = {
                    expiracao: expirationDate.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'long' }),
                    status: now > expirationDate ? "Expirado" : "Válido"
                };
            }
            return result;
        } catch (e) {
            return { error: `Erro ao decodificar o token: ${e.message}` };
        }
    }
};