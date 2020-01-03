module.exports = ({

    testEnvironment: 'node',

    testMatch: [
        '**/test/**/*.(spec|test).js',
    ],

    setupFilesAfterEnv: ['jest-extended'],

    coverageReporters: [
        'json',
        'lcov',
        'text',
        'text-summary',
    ],

});
