module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: '13.2',
                },
                modules: 'commonjs',
            },
        ],
    ],

    plugins: [],
};
