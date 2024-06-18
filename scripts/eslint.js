// Run 'eslint' with the BABEL_ENV and NODE_ENV environment variables set

const spawn = require('child_process').spawn;

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

spawn(
    'node',
    ['node_modules/eslint/bin/eslint.js', '--', '.'],
    {
        stdio: "inherit"
    }
).on('exit', (code) => {
    process.exit(code);
});
