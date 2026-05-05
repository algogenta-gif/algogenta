import { Helmet } from 'react-helmet-async'
import { SITE, absoluteUrl } from './site'

type SeoProps = {
  title?: string
  description?: string
  path?: string
  image?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
}

export default function Seo(props: SeoProps) {
  const title = props.title ? `${props.title} | ${SITE.name}` : SITE.defaultTitle
  const description = props.description || SITE.defaultDescription
  const canonical = props.path ? absoluteUrl(props.path) : SITE.url
  const image = absoluteUrl(props.image || SITE.defaultOgImage)

  const jsonLdArray = Array.isArray(props.jsonLd)
    ? props.jsonLd
    : props.jsonLd
      ? [props.jsonLd]
      : []

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {canonical ? <link rel="canonical" href={canonical} /> : null}

      {props.noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:type" content="website" />
      {image ? <meta property="og:image" content={image} /> : null}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {SITE.twitterHandle ? <meta name="twitter:site" content={SITE.twitterHandle} /> : null}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image ? <meta name="twitter:image" content={image} /> : null}

      {jsonLdArray.map((obj, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  )
}

