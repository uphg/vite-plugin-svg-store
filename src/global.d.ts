declare module 'svg-baker' {
  const SVGCompiler = class {
    addSymbol({ path, content, id }: { path: string, content: string, id: string }): Promise<{ render(): string }>
    compile(): Promise<{ render(): string }[]>
  }

  export default SVGCompiler;
}
