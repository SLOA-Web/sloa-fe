export const runtime = 'edge';
import { notFound } from 'next/navigation'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { SanityImageBlock } from '@/types/sanity'
import { getPublicationBySlug } from '@/libs/sanity.api'
import { urlFor } from '@/libs/image'
import type { Metadata } from 'next'

interface PublicationPageProps {
  params: Promise<{ slug: string }>
}

// PortableText components for rich content rendering
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const portableTextComponents = {
  block: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    normal: ({ children }: any) => (
      <p className="mb-6 text-gray-700 leading-relaxed">{children}</p>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">{children}</h2>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6">{children}</h3>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 my-6 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  types: {
    image: ({ value }: { value: SanityImageBlock }) => {
      if (!value?.asset?._ref) return null
      return (
        <div className="my-8">
          <Image
            src={urlFor(value).width(800).height(600).url()}
            alt={value.alt || 'Publication image'}
            width={800}
            height={600}
            className="rounded-lg shadow-md"
          />
          {value.alt && (
            <p className="text-sm text-gray-500 mt-2 text-center italic">
              {value.alt}
            </p>
          )}
        </div>
      )
    },
  },
  marks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        className="text-blue-600 hover:text-blue-700 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
}

export default async function PublicationPage(props: PublicationPageProps) {
  const params = await props.params;
  const publication = await getPublicationBySlug(params.slug)

  if (!publication) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="container mx-auto px-4 py-20 md:py-32">
      {/* Back Navigation */}
      <Link 
        href="/news-media"
        className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to News & Media
      </Link>

      <article className="max-w-4xl mx-auto">
        {/* Publication Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {publication.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center">
              <User size={20} className="mr-2" />
              <span className="font-medium">By {publication.author}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar size={20} className="mr-2" />
              <span>Published {formatDate(publication.publishedAt)}</span>
            </div>

            {publication.category && (
              <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full inline-block w-fit">
                {publication.category}
              </span>
            )}
          </div>

          {/* Featured Image */}
          {publication.image && (
            <div className="mb-8">
              <Image
                src={urlFor(publication.image).width(1200).height(600).url()}
                alt={publication.title}
                width={1200}
                height={600}
                className="rounded-lg shadow-lg w-full"
                priority
              />
            </div>
          )}

          {/* Excerpt */}
          {publication.excerpt && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed font-medium">
                {publication.excerpt}
              </p>
            </div>
          )}
        </header>

        {/* Publication Content */}
        <div className="prose prose-lg max-w-none">
          <PortableText 
            value={publication.body} 
            components={portableTextComponents}
          />
        </div>

        {/* SEO Keywords (if any) */}
        {publication.seo?.keywords && publication.seo.keywords.length > 0 && (
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {publication.seo.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        )}
      </article>
    </div>
  )
}

export async function generateMetadata(props: PublicationPageProps): Promise<Metadata> {
  const params = await props.params;
  const publication = await getPublicationBySlug(params.slug)

  if (!publication) {
    return {
      title: 'Publication Not Found | SLOA',
      description: 'The requested publication could not be found.',
    }
  }

  return {
    title: `${publication.title} | SLOA Publications`,
    description: publication.seo?.metaDescription || publication.excerpt || `A publication by ${publication.author} published by SLOA.`,
    keywords: publication.seo?.keywords?.join(', '),
    authors: [{ name: publication.author }],
    openGraph: {
      title: publication.seo?.metaTitle || publication.title,
      description: publication.seo?.metaDescription || publication.excerpt,
      type: 'article',
      publishedTime: publication.publishedAt,
      authors: [publication.author],
    },
  }
}
