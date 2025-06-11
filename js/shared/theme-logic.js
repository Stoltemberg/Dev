export function initializeTheme() {
    const themeSwitcher = document.getElementById('theme-switcher');
    if (!themeSwitcher) return;
    
    const body = document.body;
    const applyTheme = (theme) => {
        body.classList.toggle('light-mode', theme === 'light');
        body.classList.toggle('dark-mode', theme !== 'light');
        themeSwitcher.innerHTML = theme === 'light' ? '🌙' : '☀️';
    };

    const currentTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(currentTheme);

    themeSwitcher.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}