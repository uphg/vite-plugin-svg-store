import path from 'path'
import esbuild from 'rollup-plugin-esbuild'
import typescript from 'rollup-plugin-typescript2';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entryFile = 'src/index.ts'

const outputConfigs = {
  esm: {
    preserveModules: true,
    dir: 'dist',
    format: 'es',
    exports: 'auto'
  },
  cjs: {
    preserveModules: true,
    dir: 'dist/cjs',
    format: 'cjs',
    exports: 'auto'
  }
}

const esbuildPlugin = esbuild({
  include: /\.[jt]s$/,
  minify: process.env.NODE_ENV === 'production',
  target: 'es2015'
})

const tsPlugin = typescript({
  check: process.env.NODE_ENV === 'production',
  tsconfig: 'tsconfig.json',
  tsconfigOverride: {
    compilerOptions: {
      sourceMap: false,
      declaration: true,
      declarationMap: false,
      rootDir: './src',
      outDir: 'dist',
      declarationDir: 'dist'
    }
  }
})

function createConfig(env) {
  const { ESM = false, CJS = false } = env || {}

  const format = ESM ? 'esm' : (CJS ? 'cjs' : 'umd')

  return {
    input: path.resolve(__dirname, entryFile),
    output: outputConfigs[format],
    plugins: [tsPlugin, esbuildPlugin]
  }
}

export default createConfig(process.env)
