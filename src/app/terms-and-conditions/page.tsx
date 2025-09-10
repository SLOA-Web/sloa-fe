import { getPageBySlug } from '@/libs/sanity.api'
import { notFound } from 'next/navigation'
import { PortableTextComponent } from '@/components/PortableTextComponent'

const styles = {
  mainContainer: {
    paddingTop: '8rem', 
    paddingBottom: '4rem',
  },
  contentWrapper: { 
    maxWidth: '800px', 
    margin: '0 auto', 
    padding: '0 1rem', 
    color: '#333',
  },
  title: { 
    fontSize: '3rem', 
    fontWeight: 'bold',
    marginBottom: '1rem',
    lineHeight: '1.2'
  },
  description: { 
    fontSize: '1.2rem', 
    color: '#666', 
    marginBottom: '3rem',
    borderLeft: '4px solid #0070f3',
    paddingLeft: '1rem',
  },
  contentBody: { 
    lineHeight: '1.8', 
    fontSize: '1.1rem',
  },
};

export default async function TermsAndConditionsPage() {
  const page = await getPageBySlug('terms-and-conditions');

  if (!page) {
    notFound();
  }

  return (
    <main style={styles.mainContainer}>
      <div style={styles.contentWrapper}>
        <h1 style={styles.title}>{page.title}</h1>
        {page.description && <p style={styles.description}>{page.description}</p>}

        <div style={styles.contentBody}>
          <PortableTextComponent value={page.content} />
        </div>
      </div>
    </main>
  );
}