import { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface PatternVisualizationProps {
  visualSvg: string;
  patternName: string;
}

function flattenNestedSvg(rawSvg: string): string {
  // Remove nested <svg ...> wrappers but keep their contents.
  return rawSvg
    .replace(/<svg\b[^>]*>/gi, '')   // remove opening <svg ...>
    .replace(/<\/svg>/gi, '');       // remove closing </svg>
}

function ensureSvgSizing(flattened: string): string {
  let ensured = flattened;
  if (ensured.startsWith('<svg')) {
    // Inject style/width/height if missing (preserve existing viewBox from backend)
    ensured = ensured.replace(
      /<svg\b([^>]*)>/i,
      (match, attrs) => {
        const hasWidth = /\bwidth\s*=/.test(attrs);
        const hasHeight = /\bheight\s*=/.test(attrs);
        const hasStyle = /\bstyle\s*=/.test(attrs);

        const addWidth = hasWidth ? '' : ' width="100%"';
        const addHeight = hasHeight ? '' : ' height="100%"';
        const addStyle = hasStyle ? '' : ' style="display:block"';

        return `<svg${attrs}${addWidth}${addHeight}${addStyle}>`;
      }
    );
  } else {
    // If somehow not an svg root, wrap it (keep generous viewBox for borders)
    ensured = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -120 540 640" width="100%" height="100%" style="display:block">${flattened}</svg>`;
  }
  return ensured;
}

export default function PatternVisualization({ visualSvg, patternName }: PatternVisualizationProps) {
  const sanitizedSvg = useMemo(() => {
    const raw = visualSvg?.trim();
    if (!raw) return '';

    // Flatten nested SVGs (fixes blank preview in many browsers)
    const flattened = flattenNestedSvg(raw);

    // Ensure outer svg has explicit sizing
    const ensured = ensureSvgSizing(flattened);

    return DOMPurify.sanitize(ensured, {
      USE_PROFILES: { svg: true },
      ADD_TAGS: [
        'filter', 'feGaussianBlur', 'feOffset', 'feComponentTransfer', 'feFuncA', 'feMerge', 'feMergeNode',
        'pattern', 'circle', 'image', 'defs'
      ],
      ADD_ATTR: [
        'stdDeviation', 'dx', 'dy', 'slope', 'in', 'result', 'type', 'id', 'patternUnits',
        'x', 'y', 'width', 'height', 'cx', 'cy', 'r', 'opacity', 'filter', 'fill', 'viewBox',
        'href', 'xlink:href', 'preserveAspectRatio'
      ],
    });
  }, [visualSvg]);

  return (
    <div className="bg-gray-50 rounded-lg p-6 flex justify-center">
      <div className="w-full max-w-2xl aspect-3/4 border border-gray-200 rounded bg-white overflow-hidden">
        {sanitizedSvg ? (
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
            aria-label={`${patternName} quilt pattern visualization`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-red-500">
            SVG preview unavailable (empty or invalid).
          </div>
        )}
      </div>
    </div>
  );
}
