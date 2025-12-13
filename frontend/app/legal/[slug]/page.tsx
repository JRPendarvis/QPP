import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
        <article className="prose" dangerouslySetInnerHTML={{ __html: safeHtml }} />
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
          <article className="prose" dangerouslySetInnerHTML={{ __html: safeHtml }} />
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
    return <div className="p-8">Failed to load document</div>;
  }