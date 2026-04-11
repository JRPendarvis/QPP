import { PDFInstructionRenderer } from '../pdfInstructionRenderer';

function createMockDoc() {
  return {
    y: 100,
    fontSize: jest.fn().mockReturnThis(),
    font: jest.fn().mockReturnThis(),
    fillColor: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    moveDown: jest.fn().mockReturnThis(),
    rect: jest.fn().mockReturnThis(),
    roundedRect: jest.fn().mockReturnThis(),
    stroke: jest.fn().mockReturnThis(),
    addPage: jest.fn().mockReturnThis(),
  };
}

describe('PDFInstructionRenderer', () => {
  it('renders recommendation outside numbered steps and removes source metadata from steps', () => {
    const renderer = new PDFInstructionRenderer();
    const doc = createMockDoc() as any;

    renderer.renderCompleteInstructionSection(
      doc,
      [
        'Instruction source: DETERMINISTIC (patternId=pinwheel)',
        '📌 IMPORTANT: This is only a recommendation. You are free to design this quilt however you wish — rearrange blocks, change colors, or modify the layout to suit your creative vision!',
        'Quilt size: 60" × 72". Layout: 5 × 6 blocks (30 total). Finished block size: 12" square.',
        'Finish: Layer with batting and backing, quilt as desired, and bind.',
      ],
      'pinwheel'
    );

    expect(doc.roundedRect).toHaveBeenCalled();

    const renderedTextCalls = doc.text.mock.calls.map((call: any[]) => call[0]);
    expect(renderedTextCalls).toContain('IMPORTANT:');

    const stepNumberCalls = renderedTextCalls.filter(
      (value: unknown) => value === '1.' || value === '2.' || value === '3.'
    );
    expect(stepNumberCalls).toEqual(['1.', '2.']);

    const fullText = renderedTextCalls.join(' ');
    expect(fullText).not.toContain('Instruction source: DETERMINISTIC');
    expect(fullText).not.toContain('📌');
  });
});