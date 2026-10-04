import { build, context } from 'esbuild';
import { cp, mkdir, rm } from 'node:fs/promises';

const watch = process.argv.includes('--watch');
const outdir = 'dist';

await rm(outdir, { recursive: true, force: true });
await mkdir(outdir, { recursive: true });
await cp('public', outdir, { recursive: true });

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: ['src/background.ts', 'src/content.ts', 'src/options.ts', 'src/popup.ts'],
  bundle: true,
  format: 'iife',
  target: 'chrome120',
  outdir,
  logLevel: 'info',
};

if (watch) {
  const ctx = await context(options);
  await ctx.watch();
  console.log('Izleme modu acik. Kaydettikce dist/ guncellenir. (public/ degisirse yeniden "npm run build" calistir.)');
} else {
  await build(options);
  console.log('Hazir: dist/ klasorunu chrome://extensions sayfasindan yukleyin.');
}
