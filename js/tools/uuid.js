export const Uuid = {
    // A função principal agora aceita um objeto de opções
    generate: function(options = {}) {
        const {
            count = 1,
            uppercase = false,
            noHyphens = false
        } = options;

        const uuids = [];

        for (let i = 0; i < count; i++) {
            let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            if (uppercase) {
                uuid = uuid.toUpperCase();
            }

            if (noHyphens) {
                uuid = uuid.replace(/-/g, '');
            }
            
            uuids.push(uuid);
        }
        
        return uuids;
    }
};