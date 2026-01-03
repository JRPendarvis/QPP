import { PatternDefinition } from '../../../types/PatternDefinition';
import { CHURN_DASH_TEMPLATE } from './template';
import { CHURN_DASH_PROMPT } from './prompt';

const ChurnDash: PatternDefinition = {
  id: 'churn-dash',
  name: 'Churn Dash',
  template: CHURN_DASH_TEMPLATE,
  prompt: CHURN_DASH_PROMPT,
  minFabrics: 2,
  maxFabrics: 3,
  allowRotation: true,
  rotationStrategy: 'alternate-90',
  fabricRoles: [
    'Background',
    'Rails (Dash Pieces)',
    'Center & Accents',
  ],

  /**
   * Churn Dash (classic) color roles for this SVG template:
   *
   * COLOR1 = Background (base + half of rail units + half of corner HSTs)
   * COLOR2 = Rails accent (the "dash" pieces)
   * COLOR3 = Accent for center square + corner HST accent triangles
   *
   * 2 fabrics:
   * - background + primary
   * - primary is used for BOTH COLOR2 and COLOR3 so the block still reads correctly
   *
   * 3 fabrics:
   * - background + primary(rails) + secondary(center/HST accent)
   *
   * Returns: [background, rails, accent]
   */
  getColors: (
    fabricColors: string[],
    _opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const rails = fabricColors[1] ?? background;

    // If no 3rd fabric, use rails for accent too.
    const accent = fabricColors[2] ?? rails;

    return [background, rails, accent];
  }
};

export default ChurnDash;
