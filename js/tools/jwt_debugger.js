const JwtDebugger = {
    decode: function(token) {
        if (!token || token.split('.').length !== 3) {
            return { error: "Token JWT inválido. Ele deve conter três partes separadas por pontos." };
        }
        try {
            // A biblioteca jwt_decode será importada via CDN no index.html
            const decodedHeader = jwt_decode(token, { header: true });
            const decodedPayload = jwt_decode(token);
            
            const result = {
                header: decodedHeader,
                payload: decodedPayload
            };

            if (decodedPayload.exp) {
                const expirationDate = new Date(decodedPayload.exp * 1000);
                const now = new Date();
                result.extra = {
                    expiracao: expirationDate.toLocaleString('pt-BR'),
                    status: now > expirationDate ? "Expirado" : "Válido"
                };
            }
            return result;
        } catch (e) {
            return { error: `Erro ao decodificar o token: ${e.message}` };
        }
    }
};