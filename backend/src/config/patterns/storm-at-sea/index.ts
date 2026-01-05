import { PatternDefinition } from '../../../types/PatternDefinition';
import { STORM_AT_SEA_TEMPLATE } from './template';
import { STORM_AT_SEA_PROMPT } from './prompt';

const StormAtSea: PatternDefinition = {
  id: 'storm-at-sea',
  name: 'Storm at Sea',
  enabled: false,
  template: STORM_AT_SEA_TEMPLATE,
  prompt: STORM_AT_SEA_PROMPT,
  minFabrics: 2,
  maxFabrics: 3,
  allowRotation: false,
  rotationStrategy: 'parity-2x2',
  fabricRoles: [
    'Background',
    'Waves/Diamonds',
    'Square Centers',
    'Accent',
  ],
  
  /**
   * Storm at Sea - creates optical illusion of turbulent waves
   * fabricColors[0] = Background (large squares and background areas)
   * fabricColors[1] = Primary (wave/diamond shapes)
   * fabricColors[2] = Secondary (square-in-a-square centers)
   * fabricColors[3] = Accent (optional - additional wave or center variety)
   * 
   * Colors must stay CONSISTENT across all blocks - the wave optical illusion
   * only emerges when blocks are tiled with perfect color alignment
   * 
   * 3 fabrics: Traditional Storm at Sea (Background + Primary waves + Secondary centers)
   * 4 fabrics: Adds Accent for additional variety
   * 
   * Returns: [background, waves, centers, accent]
   */
  getColors: (
    fabricColors: string[],
    opts: { blockIndex?: number; row?: number; col?: number } = {}
  ): string[] => {
    const background = fabricColors[0];
    const primary = fabricColors[1] || background;
    const secondary = fabricColors[2] || primary;
    const accent = fabricColors[3] || secondary;
    
    return [background, primary, secondary, accent];
  }
};

export default StormAtSea;