import { optimize, Config as SvgoOptimizeOptions } from 'svgo'
import { Plugin } from 'vite'
import fg from 'fast-glob'
import fs from 'fs'
import SVGCompiler from 'svg-baker'

export type { SvgoOptimizeOptions };
export interface SvgStoreOptions {
  inputDirs?: string
  symbolId?: string // 'icon-[name]'
  optimizeOptions?: boolean | SvgoOptimizeOptions
  containerId?: string
}

const SVG_STORE_ID = 'virtual:svg-store'
const XMLNS = 'http://www.w3.org/2000/svg'
const XMLNS_LINK = 'http://www.w3.org/1999/xlink'

export default (options?: SvgStoreOptions) => {
  const { optimizeOptions, symbolId } = options ?? {}
  const inputDirs = options?.inputDirs ?? ['src/assets/icons'];
  const containerId = options?.containerId ?? '__svg__store__dom__'

  const plugin: Plugin = {
    name: 'vite:svg-store',

    resolveId(id: string) {
      if (id === SVG_STORE_ID) { return id }
    },

    async load(id: string) {
      if (id !== SVG_STORE_ID) { return }

      const svgCompiler = new SVGCompiler();
      let sprite = '' 

      for (const dir of inputDirs) {
        const filePaths = fg.sync('**/*.svg', { cwd: dir, absolute: true })

        if (filePaths.length <= 0) { continue }

        for (const path of filePaths) {
          const name = getFileName(path)
          const file = fs.readFileSync(path, 'utf8');
          const content = optimizeOptions ? optimize(file, optimizeOptions === true ? undefined : optimizeOptions).data : file
          const id = symbolId ? symbolId.replace(/\[name\]/g, name) : name
          const svg = await svgCompiler.addSymbol({ id, content, path })

          sprite += svg.render()
        }
      }

      const result = createMount(sprite, containerId)
      return result
    }
  };

  return plugin;
};

function getFileName(filePath: string) {
  return filePath.replace(/^.*[\\/]/, '').replace(/\.[^.]+$/, '');
}

function createMount(code: string, containerId: string) {
  return (`
if (typeof window !== 'undefined') {
  function load() {
    const div = document.createElement('div')
    const svg = document.createElementNS('${XMLNS}', 'svg');
  
    svg.innerHTML = \`${code}\`
    svg.id = '${containerId}';
    svg.setAttribute('xmlns','${XMLNS}');
    svg.setAttribute('xmlns:link','${XMLNS_LINK}');
  
    div.style.position = 'absolute'
    div.style.width = '0'
    div.style.height = '0'
    div.style.overflow = 'hidden'
    div.setAttribute("aria-hidden", "true")
    div.appendChild(svg)
  
    if (document.body.firstChild) {
      document.body.insertBefore(div, document.body.firstChild)
    } else {
      document.body.appendChild(div)
    }
  }
  
  // listen dom ready event
  document.addEventListener('DOMContentLoaded', load)
}
`)
}
