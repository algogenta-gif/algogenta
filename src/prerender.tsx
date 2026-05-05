import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import LandingPage from './pages/public/LandingPage'
import BlogListPage from './pages/public/BlogListPage'
import BlogPostPage from './pages/public/BlogPostPage'
import LoginPage from './pages/public/LoginPage'

import { SITE, absoluteUrl } from './seo/site'
import { getPostBySlug } from './content/blog/posts'

type PrerenderData = { url: string }

function getSeoForUrl(url: string) {
  // Strip query/hash
  const cleanUrl = url.split('#')[0].split('?')[0]

  if (cleanUrl === '/' || cleanUrl === '') {
    return {
      title: SITE.defaultTitle,
      description: SITE.defaultDescription,
      canonical: SITE.url ? absoluteUrl('/') : '',
      noindex: false,
    }
  }

  if (cleanUrl === '/blog') {
    return {
      title: `Blog | ${SITE.name}`,
      description: 'Insights, playbooks, and practical guides on voice AI, lead automation, and appointment booking.',
      canonical: SITE.url ? absoluteUrl('/blog') : '',
      noindex: false,
    }
  }

  if (cleanUrl.startsWith('/blog/')) {
    const slug = cleanUrl.replace('/blog/', '').replace(/\/+$/, '')
    const post = getPostBySlug(slug)
    if (post) {
      return {
        title: `${post.title} | ${SITE.name}`,
        description: post.description,
        canonical: SITE.url ? absoluteUrl(`/blog/${post.slug}`) : '',
        noindex: false,
      }
    }
  }

  if (cleanUrl === '/login') {
    return {
      title: `Login | ${SITE.name}`,
      description: 'Sign in to your Algogenta account.',
      canonical: SITE.url ? absoluteUrl('/login') : '',
      noindex: true,
    }
  }

  // Unknown routes: let SPA handle; don't ask crawlers to index.
  return {
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
    canonical: SITE.url ? absoluteUrl('/') : '',
    noindex: true,
  }
}

export async function prerender(data: PrerenderData) {
  const url = data.url || '/'

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider>
        <StaticRouter location={url}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  )

  const seo = getSeoForUrl(url)

  const elementsArray: any[] = [
    { type: 'meta', props: { name: 'description', content: seo.description } },
    seo.noindex
      ? { type: 'meta', props: { name: 'robots', content: 'noindex, nofollow' } }
      : { type: 'meta', props: { name: 'robots', content: 'index, follow, max-image-preview:large' } },
    { type: 'meta', props: { property: 'og:site_name', content: SITE.name } },
    { type: 'meta', props: { property: 'og:title', content: seo.title } },
    { type: 'meta', props: { property: 'og:description', content: seo.description } },
    { type: 'meta', props: { property: 'og:type', content: 'website' } },
    seo.canonical ? { type: 'meta', props: { property: 'og:url', content: seo.canonical } } : null,
    { type: 'meta', props: { property: 'og:image', content: absoluteUrl(SITE.defaultOgImage) } },
    { type: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },
    { type: 'meta', props: { name: 'twitter:title', content: seo.title } },
    { type: 'meta', props: { name: 'twitter:description', content: seo.description } },
    { type: 'meta', props: { name: 'twitter:image', content: absoluteUrl(SITE.defaultOgImage) } },
  ].filter(Boolean)

  if (seo.canonical) elementsArray.push({ type: 'link', props: { rel: 'canonical', href: seo.canonical } })

  if (SITE.twitterHandle) elementsArray.push({ type: 'meta', props: { name: 'twitter:site', content: SITE.twitterHandle } })

  const elements = new Set<any>(elementsArray)

  return {
    html,
    links: new Set<string>(),
    head: {
      title: seo.title,
      elements,
    },
  }
}

