import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'
import path from 'node:path'
import fs from 'node:fs'

export default defineConfig({
  plugins: [
    react(),
    vitePrerenderPlugin({
      renderTarget: '#root',
      prerenderScript: path.resolve(__dirname, 'src/prerender.tsx'),
      additionalPrerenderRoutes: getPrerenderRoutes(),
    }),
  ],
})

function getPrerenderRoutes() {
  // Only public routes. Authenticated routes remain SPA-only.
  const routes = ['/', '/blog']

  // Include all blog posts so each gets a real HTML file.
  try {
    const postsPath = path.resolve(__dirname, 'src/content/blog/posts.ts')
    const src = fs.readFileSync(postsPath, 'utf8')
    const slugs = Array.from(src.matchAll(/slug:\s*'([^']+)'/g)).map(m => m[1])
    for (const slug of slugs) routes.push(`/blog/${slug}`)
  } catch {
    // ignore
  }

  return routes
}
