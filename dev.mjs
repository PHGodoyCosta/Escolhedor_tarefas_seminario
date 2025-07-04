// dev.mjs
import { spawn } from 'node:child_process';

const electron = spawn(
    'npx',
    [
        'electron',
        '--no-warnings',
        '--loader',
        'ts-node/esm',
        './src/index.ts'
    ],
    { stdio: 'inherit', shell: true }
);

electron.on('close', (code) => {
    process.exit(code);
});
