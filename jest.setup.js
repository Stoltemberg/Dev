// Mock do localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key]),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn(key => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock do matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
    }))
});

// Mock do ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

// Mock do IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

// Mock do fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        blob: () => Promise.resolve(new Blob())
    })
);

// Mock do URL.createObjectURL
window.URL.createObjectURL = jest.fn();

// Mock do URL.revokeObjectURL
window.URL.revokeObjectURL = jest.fn();

// Mock do console
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn()
};

// Limpa todos os mocks após cada teste
afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
});

// Configuração global de timeout
jest.setTimeout(10000);

// Mock do Service Worker
if (typeof window !== 'undefined') {
    window.navigator.serviceWorker = {
        register: jest.fn().mockResolvedValue({
            scope: '/',
            unregister: jest.fn().mockResolvedValue(true)
        })
    };
}

// Mock do Notification
if (typeof window !== 'undefined') {
    window.Notification = {
        permission: 'granted',
        requestPermission: jest.fn().mockResolvedValue('granted')
    };
}

// Mock do Clipboard API
if (typeof window !== 'undefined') {
    window.navigator.clipboard = {
        writeText: jest.fn().mockResolvedValue(undefined),
        readText: jest.fn().mockResolvedValue('')
    };
}

// Mock do FileReader
if (typeof window !== 'undefined') {
    window.FileReader = jest.fn().mockImplementation(() => ({
        readAsText: jest.fn(),
        readAsDataURL: jest.fn(),
        readAsArrayBuffer: jest.fn(),
        result: '',
        onload: null,
        onerror: null
    }));
}

// Mock do Blob
if (typeof window !== 'undefined') {
    window.Blob = jest.fn().mockImplementation((parts, options) => ({
        size: 0,
        type: options?.type || '',
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
        text: jest.fn().mockResolvedValue(''),
        slice: jest.fn().mockReturnThis()
    }));
}

// Mock do File
if (typeof window !== 'undefined') {
    window.File = jest.fn().mockImplementation((bits, name, options) => ({
        name,
        size: 0,
        type: options?.type || '',
        lastModified: Date.now(),
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
        text: jest.fn().mockResolvedValue(''),
        slice: jest.fn().mockReturnThis()
    }));
}

// Mock do FormData
if (typeof window !== 'undefined') {
    window.FormData = jest.fn().mockImplementation(() => ({
        append: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
        getAll: jest.fn(),
        has: jest.fn(),
        set: jest.fn(),
        forEach: jest.fn()
    }));
}

// Mock do XMLHttpRequest
if (typeof window !== 'undefined') {
    window.XMLHttpRequest = jest.fn().mockImplementation(() => ({
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
        getAllResponseHeaders: jest.fn().mockReturnValue(''),
        getResponseHeader: jest.fn(),
        abort: jest.fn(),
        onreadystatechange: null,
        readyState: 4,
        status: 200,
        statusText: 'OK',
        response: '',
        responseText: '',
        responseXML: null
    }));
} 