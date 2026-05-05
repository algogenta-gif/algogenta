import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/public/Navbar'
import Seo from '../../seo/Seo'
import { getPostBySlug } from '../../content/blog/posts'
import { SITE, absoluteUrl } from '../../seo/site'

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = slug ? getPostBySlug(slug) : undefined

  if (!post) {
    return (
      <div className="min-h-screen bg-dark-900 grid-bg">
        <Seo title="Post not found" description="This blog post could not be found." path="/blog" noindex />
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 pt-16 pb-24">
          <div className="glass rounded-3xl p-8 glow-border">
            <h1 className="font-display font-bold text-3xl text-white">Post not found</h1>
            <p className="text-slate-400 mt-3">The link may be broken, or the post was moved.</p>
            <div className="mt-8">
              <Link to="/blog" className="btn-primary">Go to Blog</Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const postUrl = SITE.url ? absoluteUrl(`/blog/${post.slug}`) : ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: postUrl || undefined,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
  }

  return (
    <div className="min-h-screen bg-dark-900 grid-bg">
      <Seo
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        jsonLd={jsonLd}
      />

      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-14 pb-24">
        <article className="glass rounded-3xl p-8 md:p-10 glow-border">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Link to="/blog" className="btn-secondary">
              Back to Blog
            </Link>
            <div className="text-sm text-slate-400">{post.publishedAt}</div>
          </div>

          <header className="mt-8">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight">
              {post.title}
            </h1>
            <p className="text-slate-400 mt-4 leading-relaxed">{post.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </header>

          <div className="mt-10 space-y-6">
            {post.content.map((block, idx) => {
              if (block.kind === 'h2') {
                return (
                  <h2 key={idx} className="text-white font-display font-semibold text-xl md:text-2xl pt-2">
                    {block.text}
                  </h2>
                )
              }
              if (block.kind === 'ul') {
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-2 text-slate-300 leading-relaxed">
                    {block.items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                )
              }
              return (
                <p key={idx} className="text-slate-300 leading-relaxed">
                  {block.text}
                </p>
              )
            })}
          </div>

          <footer className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="text-sm text-slate-400">
                Want this implemented for your business? Algogenta Automation can help.
              </div>
              <Link to="/#pricing" className="btn-primary">
                Get Started
              </Link>
            </div>
          </footer>
        </article>
      </main>
    </div>
  )
}

