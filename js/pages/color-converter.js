import { ColorConverter } from '../tools/color_converter.js';

export function initColorConverterPage() {
    const pickerInput = document.getElementById('color-picker-input');
    const hexInput = document.getElementById('hex-color-input');
    const rgbInput = document.getElementById('rgb-color-input');
    const hslInput = document.getElementById('hsl-color-input');
    const swatch = document.getElementById('color-swatch');
    const colorNameDisplay = document.querySelector('#color-details .color-name');

    let isUpdating = false;
    let nameDebounceTimer;

    async function updateColors(source, value) {
        if (isUpdating) return;
        isUpdating = true;

        let r, g, b, hex;

        try {
            switch(source) {
                case 'picker':
                case 'hex':
                    hex = value.startsWith('#') ? value : '#' + value;
                    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) { isUpdating = false; return; }
                    const rgbObj = ColorConverter.hexToRgbObj(hex);
                    r = rgbObj.r; g = rgbObj.g; b = rgbObj.b;
                    break;
                case 'rgb':
                    const rgbMatch = value.match(/(\d+),\s*(\d+),\s*(\d+)/);
                    if (!rgbMatch) { isUpdating = false; return; }
                    [r, g, b] = [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
                    if (r > 255 || g > 255 || b > 255) { isUpdating = false; return; }
                    hex = ColorConverter.rgbToHex(r, g, b);
                    break;
                case 'hsl':
                     const hslMatch = value.match(/(\d+),\s*(\d+)%?,\s*(\d+)%?/);
                     if (!hslMatch) { isUpdating = false; return; }
                     const hslObj = ColorConverter.hslToRgbObj(parseInt(hslMatch[1]), parseInt(hslMatch[2]), parseInt(hslMatch[3]));
                     r = hslObj.r; g = hslObj.g; b = hslObj.b;
                     hex = ColorConverter.rgbToHex(r, g, b);
                    break;
                default:
                    isUpdating = false; return;
            }

            const hslObj = ColorConverter.rgbToHslObj(r, g, b);

            if (source !== 'picker') pickerInput.value = hex;
            if (source !== 'hex') hexInput.value = hex;
            if (source !== 'rgb') rgbInput.value = `rgb(${r}, ${g}, ${b})`;
            if (source !== 'hsl') hslInput.value = `hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`;

            swatch.style.backgroundColor = hex;
            
            // Debounce para a chamada da API de nome de cor
            clearTimeout(nameDebounceTimer);
            nameDebounceTimer = setTimeout(async () => {
                colorNameDisplay.textContent = "Buscando nome...";
                const colorName = await ColorConverter.getColorName(hex);
                colorNameDisplay.textContent = colorName;
            }, 500);

        } catch (e) {
            console.error("Erro na conversão de cor:", e);
        }
        isUpdating = false;
    }

    pickerInput.addEventListener('input', (e) => updateColors('picker', e.target.value));
    hexInput.addEventListener('input', (e) => updateColors('hex', e.target.value));
    rgbInput.addEventListener('input', (e) => updateColors('rgb', e.target.value));
    hslInput.addEventListener('input', (e) => updateColors('hsl', e.target.value));

    // Carga inicial
    updateColors('picker', pickerInput.value);
}