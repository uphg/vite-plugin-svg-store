import path from 'path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist')

run()

async function run() {
  await execa('tsc')
  if (fs.existsSync(distDir)) {
    await fs.remove(distDir)
  }

  await execa('rollup', ['-c', 'rollup.config.ts', '--environment', 'CJS', '--configPlugin', '@rollup/plugin-typescript'])
  await execa('rollup', ['-c', 'rollup.config.ts', '--environment', 'ESM', '--configPlugin', '@rollup/plugin-typescript'])
  await execa('rollup', ['-c', 'rollup.config.ts', '--configPlugin', '@rollup/plugin-typescript'])
  await execa('eslint', ['dist', '--fix'])
  console.log('> build ok!')
}
