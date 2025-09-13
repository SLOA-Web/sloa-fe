'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import { urlFor } from '@/libs/image'
import Image from 'next/image'
import type { SanityPortableText } from '@/types/sanity' // Adjust path if needed

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <Image
          src={urlFor(value).width(800).quality(90).url()}
          alt={value.alt || 'Content image'}
          width={800}
          height={600}
          style={{ 
            maxWidth: '100%', 
            height: 'auto', 
            margin: '2rem 0', 
            borderRadius: '8px' 
          }}
        />
      )
    },
  },
  
  block: {
    h1: ({ children }) => <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', margin: '1em 0' }}>{children}</h1>,
    h2: ({ children }) => <h2 style={{ fontSize: '2em', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', margin: '1.5em 0 1em' }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '1.5em 0 1em' }}>{children}</h3>,
    blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid #ddd', paddingLeft: '1.5rem', margin: '1.5em 0', fontStyle: 'italic', color: '#555' }}>{children}</blockquote>,
  },

  list: {
    bullet: ({ children }) => <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', margin: '1.5em 0' }}>{children}</ul>,
    number: ({ children }) => <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', margin: '1.5em 0' }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li style={{ marginBottom: '0.75em' }}>{children}</li>,
    number: ({ children }) => <li style={{ marginBottom: '0.75em' }}>{children}</li>,
  },

  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
      return (
        <a href={value.href} rel={rel} style={{ color: '#0070f3', textDecoration: 'underline' }}>
          {children}
        </a>
      )
    },
  },
}


export function PortableTextComponent({ value }: { value: SanityPortableText }) {
  return <PortableText value={value} components={components} />
}