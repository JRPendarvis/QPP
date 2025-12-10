import fs from 'fs/promises';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
        <article className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
