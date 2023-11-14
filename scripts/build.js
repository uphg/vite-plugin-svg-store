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
  const { v: version = '0.1.1' } = argv
  const packageJson = {
    name: 'vite-plugin-svg-store',
    version,
    description: 'SVG store plugin for Vite',
    main: 'cjs/index.js',
    module: 'index.js',
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
    license: 'MIT',
    keywords: ['vite', 'vite-plugin', 'svg', 'sprite', 'store', 'svgo'],
    homepage: 'https://github.com/uphg/vite-plugin-svg-store#readme',
    repository: 'uphg/vite-plugin-svg-store',
    bugs: 'uphg/vite-plugin-svg-store/issues',
    author: 'Lv Heng <lvheng233@gmail.com>',
    peerDependencies: {
      vite: '^4.5.0'
    }
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
