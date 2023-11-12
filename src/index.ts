import { optimize, Config as SvgoOptimizeOptions } from 'svgo';
import { Plugin } from 'vite';
import fg from "fast-glob"
import fs from 'fs'
import SVGCompiler from 'svg-baker';
const SVG_STORE_ID = 'virtual:svg-store'

export type { SvgoOptimizeOptions };
export interface SvgStoreOptions {
  input?: string
  symbolId: string // 'icon-[name]'
}

export default (options?: SvgStoreOptions) => {
  const inputFolder = options?.input ?? 'src/assets/icons';

  
  const plugin: Plugin = {
    name: 'vite:svg-store',

    resolveId(id: string) {
      if (id === SVG_STORE_ID) {
        return id
      }
    },

    async load(id: string) {
      if (id === SVG_STORE_ID) {
        const svgCompiler = new SVGCompiler();
        const filePaths = await fg([`${inputFolder}/**/*.svg`])

        filePaths.forEach((filePath: string) => {
          const name = getFileName(filePath)
          const code = fs.readFileSync(filePath, 'utf8');
          const svg = svgCompiler.addSymbol({
            id: options?.symbolId ? options?.symbolId.replace(/\[name\]/g, name) : name,
            content: code,
            path: filepath,
          })
        })

        return createMount()
      }
    }
  };

  return plugin;
};

function getFileName(filePath: string) {
  return filePath.replace(/^.*[\\/]/, '').replace(/\.[^.]+$/, '');
}


function createSymbolString(svgFiles: string[]) {
  svgFiles.forEach((filePath) => {
    // 加载 SVG 文件
    const svgFile = fs.readFileSync(filePath, 'utf8');
    const svg = svgBaker.load(svgFile);
  
    // 创建 <symbol> 标签元素
    const symbolElement = document.createElement('symbol');
  
    // 设置 <symbol> 标签的 ID
    // 这里假设每个 SVG 文件的 ID 与文件名（不含扩展名）相同
    const symbolId = filePath.replace(/^.*[\\/]/, '').replace(/\.[^.]+$/, '');
    symbolElement.setAttribute('id', symbolId);
  
    // 使用 SvgBaker 创建 <symbol> 标签的内容
    const symbolContent = svgBaker.createSymbol(svg);
  
    // 将内容设置为 <symbol> 标签的 innerHTML
    symbolElement.innerHTML = symbolContent;
  
    // 将 <symbol> 标签插入容器元素
    container.appendChild(symbolElement);
  });
}

svgFiles.forEach((filePath) => {
  // 加载 SVG 文件
  const svgFile = fs.readFileSync(filePath, 'utf8');
  const svg = svgBaker.load(svgFile);

  // 创建 <symbol> 标签元素
  const symbolElement = document.createElement('symbol');

  // 设置 <symbol> 标签的 ID
  // 这里假设每个 SVG 文件的 ID 与文件名（不含扩展名）相同
  const symbolId = filePath.replace(/^.*[\\/]/, '').replace(/\.[^.]+$/, '');
  symbolElement.setAttribute('id', symbolId);

  // 使用 SvgBaker 创建 <symbol> 标签的内容
  const symbolContent = svgBaker.createSymbol(svg);

  // 将内容设置为 <symbol> 标签的 innerHTML
  symbolElement.innerHTML = symbolContent;

  // 将 <symbol> 标签插入容器元素
  container.appendChild(symbolElement);
});



function createMount(code: string) {
  return (
`const div = document.createElement('div')
div.innerHTML = \`${code}\`
const svg = div.getElementsByTagName('svg')[0]
if (svg) {
  svg.style.position = 'absolute'
  svg.style.width = 0
  svg.style.height = 0
  svg.style.overflow = 'hidden'
  svg.setAttribute("aria-hidden", "true")
}
// listen dom ready event
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.firstChild) {
    document.body.insertBefore(div, document.body.firstChild)
  } else {
    document.body.appendChild(div)
  }
})`
  )
}