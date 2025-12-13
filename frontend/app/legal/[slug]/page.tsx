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
  const fileName = slugToFile[slug];
  if (!fileName) {
    return <div className="p-8">Document not found</div>;
  }

  // Resolve potential doc locations to support different dev/prod CWDs
  const candidatePaths = [
    // monorepo: frontend/ is sibling of doc/
    path.resolve(process.cwd(), '..', 'doc', fileName),
    // project root has doc/
    path.resolve(process.cwd(), 'doc', fileName),
    // containerized envs where cwd may be /app
    path.resolve(process.cwd(), '..', '..', 'doc', fileName),
  ];

  let content = '';
  let loadedPath: string | null = null;
  for (const p of candidatePaths) {
    try {
      await fs.access(p);
      content = await fs.readFile(p, 'utf-8');
      loadedPath = p;
      break;
    } catch {
      // try next path
    }
  }

  if (!loadedPath) {
    console.error('Failed to load doc: file not found', {
      slug,
      fileName,
      cwd: process.cwd(),
      attempted: candidatePaths,
    });
    return <div className="p-8">Failed to load document</div>;
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
}
