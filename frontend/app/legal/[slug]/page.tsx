import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

interface Props {
  params: { slug: string };
}

const slugToFile: Record<string, string> = {
  'terms-of-service': 'terms-of-service.md',
  'privacy-policy': 'privacy-policy.md',
  'refund-policy': 'refund-policy.md',
  'pricing-structure': 'pricing-structure.md',
};

export default async function DocPage({ params }: Props) {
  const { slug } = params;
  const fileName = slugToFile[slug];
  if (!fileName) {
    return <div className="p-8">Document not found</div>;
  }

  const docPath = path.join(process.cwd(), 'doc', fileName);
  let content = '';
  try {
    content = await fs.readFile(docPath, 'utf-8');
  } catch (err) {
    console.error('Failed to load doc', err);
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
