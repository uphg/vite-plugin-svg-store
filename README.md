# vite-plugin-svg-store

A vite plugin for making svg sprites.

## installation

```bash
pnpm add -D vite-plugin-svg-store
# or npm install -D vite-plugin-svg-store
```

## usage

```javascript
// vite.config.ts
import svgStore from 'vite-plugin-svg-store'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ...
    svgStore({
      dirs: ['src/assets/icons'], // default ['src/assets/icons']
      symbolId: 'icon-[name]'
    })
  ]
})
```
