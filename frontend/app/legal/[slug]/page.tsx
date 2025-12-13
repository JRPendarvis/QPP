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

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  console.log('Legal doc request - URL slug:', slug);
  const fileName = slugToFile[slug];
  if (!fileName) {
    console.error('Invalid slug:', slug, 'Valid slugs:', Object.keys(slugToFile));
    return <div className="p-8">Document not found</div>;
  }
  console.log('Mapped to file:', fileName);

  // Use public folder path (most reliable for Next.js)
  const docPath = path.join(process.cwd(), 'public', 'doc', fileName);

  try {
    const content = await fs.readFile(docPath, 'utf-8');
    console.log('Successfully loaded:', docPath);

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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <article 
              className="prose prose-gray max-w-none 
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:border-b prose-h1:pb-4
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
                prose-ul:text-gray-700 prose-ol:text-gray-700
                prose-strong:text-gray-900 prose-strong:font-semibold"
              dangerouslySetInnerHTML={{ __html: safeHtml }} 
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to load doc:', {
      slug,
      fileName,
      docPath,
      error: error instanceof Error ? error.message : 'Unknown error',
      cwd: process.cwd(),
    });
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
}
    return <div className="p-8">Failed to load document</div>;
  }
}