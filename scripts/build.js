import path from 'path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { fileURLToPath } from 'url';
import minimist from 'minimist'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist')
const resolve = (p) => path.resolve(distDir, p)
const argv = minimist(process.argv.slice(2));

// use pnpm build -v 0.1.x
run(argv)
async function run(argv) {
  const { v: version = '0.1.0' } = argv
  const packageJson = {
    name: 'vite-plugin-svg-store',
    version,
    license: 'MIT',
    main: 'cjs/index.js',
    type: 'module',
    exports: {
      '.': {
        import: {
          types: './index.d.ts',
          default: './index.js'
        },
        require: {
          types: './cjs/index.d.ts',
          default: './cjs/index.js'
        }
      }
    },
    types: 'index.d.ts',
    description: 'SVG store plugin for Vite',
    keywords: ['vite', 'svg', 'store'],
    homepage: 'https://github.com/uphg/utils#readme',
    repository: 'uphg/utils',
    bugs: 'uphg/utils/issues',
    author: 'Lv Heng <lvheng233@gmail.com>'
  }

  await execa('tsc')
  if (fs.existsSync(distDir)) {
    await fs.remove(distDir)
  }

  await execa('rollup', ['-c', 'rollup.config.ts', '--environment', 'CJS', '--configPlugin', '@rollup/plugin-typescript'])
  await execa('rollup', ['-c', 'rollup.config.ts', '--environment', 'ESM', '--configPlugin', '@rollup/plugin-typescript'])
  await execa('rollup', ['-c', 'rollup.config.ts', '--configPlugin', '@rollup/plugin-typescript'])
  await execa('eslint', ['dist', '--fix'])
  const strPackage = JSON.stringify(packageJson, null, 2)
  fs.writeFile(resolve('./package.json'), strPackage)
  await execa('cp', ['README.md', 'dist'])
  console.log('> build ok!')
}
