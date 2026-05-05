import { Link } from 'react-router-dom'
import Navbar from '../../components/public/Navbar'
import Seo from '../../seo/Seo'
import { BLOG_POSTS } from '../../content/blog/posts'
import { SITE } from '../../seo/site'

export default function BlogListPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE.name} Blog`,
    url: SITE.url ? `${SITE.url.replace(/\/+$/, '')}/blog` : undefined,
  }

  return (
    <div className="min-h-screen bg-dark-900 grid-bg">
      <Seo
        title="Blog"
        description="Insights, playbooks, and practical guides on voice AI, lead automation, and appointment booking."
        path="/blog"
        jsonLd={jsonLd}
      />

      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-14 pb-20">
        <div className="glass rounded-3xl p-8 md:p-10 glow-border">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-white">Blog</h1>
              <p className="text-slate-400 mt-3 max-w-2xl">
                Guides and articles about Algogenta Automation: voice AI, lead qualification, call analytics, and appointment booking.
              </p>
            </div>
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>

          <div className="mt-10 grid gap-5">
            {BLOG_POSTS.map(post => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group glass rounded-2xl p-6 border border-white/10 hover:border-brand-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="text-white font-display font-semibold text-xl group-hover:text-brand-200 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-400 mt-2 leading-relaxed">{post.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map(t => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-slate-500">Published</div>
                    <div className="text-sm text-slate-300">{post.publishedAt}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

