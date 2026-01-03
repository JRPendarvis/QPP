import { PatternDefinition } from '../../../types/PatternDefinition';
import { GRANDMOTHERS_FLOWER_GARDEN_TEMPLATE } from './template';
import { GRANDMOTHERS_FLOWER_GARDEN_PROMPT } from './prompt';

const GrandmothersFlowerGarden: PatternDefinition = {
  id: 'grandmothers-flower-garden',
  name: "Grandmother's Flower Garden",
  template: GRANDMOTHERS_FLOWER_GARDEN_TEMPLATE,
  prompt: GRANDMOTHERS_FLOWER_GARDEN_PROMPT,
  minFabrics: 3,
  maxFabrics: 8,
  allowRotation: false,
  rotationStrategy: 'none',
  fabricRoles: [
    'Pathways (Background)',
    'Flower Petal 1',
    'Flower Petal 2',
    'Flower Petal 3',
    'Flower Petal 4',
    'Flower Petal 5',
    'Flower Petal 6',
    'Flower Centers',
  ],

  /**
   * Grandmother's Flower Garden (GFG) color assignments:
   *
   * fabricColors[0] = Background (pathways/negative space)
   * fabricColors[1..n] = Flower palette used for center + petals
   *
   * MVP behavior (NOW):
   * - Center and petals are allowed to be multi-colored.
   * - We deterministically cycle through available flower fabrics per block.
   *
   * Future behavior (LATER):
   * - Add constraints to avoid same-color adjacent petals,
   *   and improve "scrappy" distribution across the quilt.
   *
   * Template expectation:
   * - COLOR1 = background
   * - COLOR2 = center
   * - COLOR3..COLOR8 = petals (6 petals)
   *
   * Returns:
   * [background, center, petal1, petal2, petal3, petal4, petal5, petal6]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];

    const flowerPalette = fabricColors.slice(1);
    if (flowerPalette.length === 0) {
      // Defensive fallback
      return [background, background, background, background, background, background, background, background];
    }

    const idx =
      opts.blockIndex ??
      (typeof opts.row === 'number' && typeof opts.col === 'number'
        ? opts.row * 1000 + opts.col
        : 0);

    // Helper to pull from flowerPalette in a stable, repeatable way
    const pick = (offset: number) => flowerPalette[(idx + offset) % flowerPalette.length];

    const center = pick(0);

    // 6 petals; offsets keep things varied even with small palettes
    const petal1 = pick(1);
    const petal2 = pick(2);
    const petal3 = pick(3);
    const petal4 = pick(4);
    const petal5 = pick(5);
    const petal6 = pick(6);

    return [background, center, petal1, petal2, petal3, petal4, petal5, petal6];
  }
};

export default GrandmothersFlowerGarden;
