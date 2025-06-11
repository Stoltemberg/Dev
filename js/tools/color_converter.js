export const ColorConverter = {
    // HEX para RGB: #RRGGBB -> {r, g, b}
    hexToRgbObj: function(hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        const bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    },

    // RGB para HEX: {r, g, b} -> #RRGGBB
    rgbToHex: function(r, g, b) {
        const toHex = c => ('0' + parseInt(c).toString(16)).slice(-2);
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    },
    
    // RGB para HSL: {r, g, b} -> {h, s, l}
    rgbToHslObj: function(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    },

    // HSL para RGB: {h, s, l} -> {r, g, b}
    hslToRgbObj: function(h, s, l) {
        s /= 100;
        l /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;
        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        return { r, g, b };
    },

    // Busca o nome da cor usando uma API pública
    getColorName: async function(hex) {
        try {
            // Remove o '#' do hex para a chamada da API
            const cleanHex = hex.replace(/^#/, '');
            const response = await fetch(`https://www.thecolorapi.com/id?hex=${cleanHex}`);
            if (!response.ok) return "Não foi possível buscar o nome";
            const data = await response.json();
            return data.name.value;
        } catch (e) {
            return "N/A";
        }
    }
};