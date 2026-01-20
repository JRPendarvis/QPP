import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import Navigation from '@/components/Navigation';

// Ensure this page runs on the Node.js runtime so we can access the filesystem
export const runtime = 'nodejs';
// Render dynamically to avoid caching issues when reading local markdown files
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

const slugToFile: Record<string, string> = {
  'terms-of-service': 'terms-of-service.md',
  'privacy-policy': 'privacy-policy.md',
  'refund-policy': 'refund-policy.md',
  'pricing-structure': 'pricing-structure.md',
};

const slugToTitle: Record<string, string> = {
  'terms-of-service': 'Terms of Service',
  'privacy-policy': 'Privacy Policy',
  'refund-policy': 'Refund Policy',
  'pricing-structure': 'Pricing Structure',
};

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const fileName = slugToFile[slug];
  if (!fileName) {
    return <div className="p-8">Document not found</div>;
  }

  // Use public folder path (most reliable for Next.js)
  const docPath = path.join(process.cwd(), 'public', 'doc', fileName);

  let content = '';
  let error: Error | null = null;

  try {
    content = await fs.readFile(docPath, 'utf-8');
  } catch (err) {
    console.error('Failed to load doc:', {
      slug,
      fileName,
      docPath,
      error: err instanceof Error ? err.message : 'Unknown error',
      cwd: process.cwd(),
    });
    error = err instanceof Error ? err : new Error('Unknown error');
  }

  // Handle error case
  if (error || !content) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">Failed to load document</p>
          </div>
        </div>
      </div>
    );
  }

  // Convert Markdown to HTML server-side and sanitize before rendering
  const rawHtml = marked.parse(content || '');
  const safeHtml = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3']),
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      {/* Header Banner */}
      <div className="py-12 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">
            {slugToTitle[slug] || 'Legal Document'}
          </h1>
        </div>
      </div>

      {/* Scrollable Document Container */}
      <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto h-full">
          <div className="bg-white rounded-lg shadow-sm h-full overflow-y-auto p-8">
            <article 
              className="prose prose-gray max-w-none 
                prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:border-b prose-h1:pb-4
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:leading-relaxed
                prose-a:no-underline hover:prose-a:underline
                prose-strong:font-semibold"
              style={{
                color: '#374151'
              }}
              dangerouslySetInnerHTML={{ __html: safeHtml }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}