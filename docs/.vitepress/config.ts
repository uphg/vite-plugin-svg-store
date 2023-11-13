import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/ts-library-starter/',
  title: "My Awesome Project",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/quick-start' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Quick Start', link: '/quick-start' },
          { text: 'Markdown Examples', link: '/markdown-examples' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/uphg/ts-library-starter' }
    ],
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/uphg/ts-library-starter/edit/master/src/:path',
    }
  }
})
