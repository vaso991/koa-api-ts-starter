const esbuild = require('esbuild')
const fs = require('fs');

const migrations = fs.readdirSync('./src/db/migrations').map(f => `./src/db/migrations/${f}`);
console.log({ migrations });

const config = {
  outdir: 'dist',
  bundle: true,
  minify: false,
  platform: 'node',
  sourcemap: true,
  target: 'node14',
  packages: 'external',
}

Promise.all([
  { entryPoints: ['./src/Server.ts'], outbase: 'src' },
  { entryPoints: [...migrations], outbase: 'src/db' },
].map(c => esbuild.build({
  ...config,
  ...c,
}))).catch(() => process.exit(1));