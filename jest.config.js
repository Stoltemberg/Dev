module.exports = {
    // Ambiente de teste
    testEnvironment: 'jsdom',
    
    // Arquivos que serão testados
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    
    // Diretórios a serem ignorados
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ],
    
    // Configuração do Babel
    transform: {
        '^.+\\.(ts|tsx|js)$': 'babel-jest'
    },
    
    // Arquivos de setup
    setupFilesAfterEnv: [
        '<rootDir>/jest.setup.js'
    ],
    
    // Cobertura de código
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/index.tsx',
        '!src/serviceWorker.ts'
    ],
    
    // Limite de cobertura
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    
    // Reporters
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: 'coverage/junit',
            outputName: 'junit.xml',
            classNameTemplate: '{classname}',
            titleTemplate: '{title}'
        }]
    ],
    
    // Configurações de módulo
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js'
    },
    
    // Timeout
    testTimeout: 10000,
    
    // Verbose
    verbose: true,
    
    // Bail
    bail: 1
}; 