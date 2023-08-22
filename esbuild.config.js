const esbuild = require('esbuild')
const fs = require('fs');
const aliasPlugin = require('esbuild-plugin-path-alias');
const path = require('path');

const migrations = fs.readdirSync('./src/db/migrations').map(f => `./src/db/migrations/${f}`);
console.log({ migrations });

const config = {
  outdir: 'dist',
  bundle: true,
  minify: false,
  platform: 'node',
  sourcemap: true,
  target: 'node18',
  packages: 'external',
  plugins: [
    aliasPlugin({
      '@App': path.resolve(__dirname, './src')
    }),
  ],
}

Promise.all([
  { entryPoints: ['./src/server.ts'], outbase: 'src' },
  { entryPoints: [...migrations], outbase: 'src/db' },
].map(c => esbuild.build({
  ...config,
  ...c,
}))).catch(() => process.exit(1));