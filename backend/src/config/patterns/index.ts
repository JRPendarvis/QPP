import { PatternDefinition } from '../../types/PatternDefinition';
import { PatternPrompt } from '../../types/PatternPrompt';

// Import all pattern definitions explicitly
import SimpleSquares from './simple-squares';
import StripQuilt from './strip-quilt';
import Checkerboard from './checkerboard';
import RailFence from './rail-fence';
import FourPatch from './four-patch';
import NinePatch from './nine-patch';
import HalfSquareTriangles from './half-square-triangles';
import Hourglass from './hourglass';
import BowTie from './bow-tie';
import FlyingGeese from './flying-geese';
import Pinwheel from './pinwheel';
import LogCabin from './log-cabin';
import SawtoothStar from './sawtooth-star';
import OhioStar from './ohio-star';
import KaleidoscopeStar from './kaleidoscope-star';
import ChurnDash from './churn-dash';
import LoneStar from './lone-star';
import MarinersCompass from './mariners-compass';
import NewYorkBeauty from './new-york-beauty';
import StormAtSea from './storm-at-sea';
import DrunkardPath from './drunkards-path';
import FeatheredStar from './mosaic-star';
import GrandmothersFlowerGarden from './grandmothers-flower-garden';
import DoubleWeddingRing from './double-wedding-ring';
import PickleDish from './pickle-dish';
import ComplexMedallion from './complex-medallion';

// Build pattern registry
const patterns: Record<string, PatternDefinition> = {
  'simple-squares': SimpleSquares,
  'strip-quilt': StripQuilt,
  'checkerboard': Checkerboard,
  'rail-fence': RailFence,
  'four-patch': FourPatch,
  'nine-patch': NinePatch,
  'half-square-triangles': HalfSquareTriangles,
  'hourglass': Hourglass,
  'bow-tie': BowTie,
  'flying-geese': FlyingGeese,
  'pinwheel': Pinwheel,
  'log-cabin': LogCabin,
  'sawtooth-star': SawtoothStar,
  'ohio-star': OhioStar,
  'kaleidoscope-star': KaleidoscopeStar,
  'churn-dash': ChurnDash,
  'lone-star': LoneStar,
  'mariners-compass': MarinersCompass,
  'new-york-beauty': NewYorkBeauty,
  'storm-at-sea': StormAtSea,
  'drunkards-path': DrunkardPath,
  'mosaic-star': FeatheredStar,
  'grandmothers-flower-garden': GrandmothersFlowerGarden,
  'double-wedding-ring': DoubleWeddingRing,
  'pickle-dish': PickleDish,
  'complex-medallion': ComplexMedallion,
};

/**
 * Get a pattern definition by ID
 */
export function getPattern(id: string): PatternDefinition | undefined {
  const pattern = patterns[id];
  if (!pattern) {
    console.warn(`⚠️ Pattern not found: "${id}"`);
    console.warn(`   Available patterns: ${Object.keys(patterns).join(', ')}`);
  }
  return pattern;
}

/**
 * Get all pattern definitions
 */
export function getAllPatterns(): PatternDefinition[] {
  return Object.values(patterns);
}

/**
 * Get all pattern IDs
 */
export function getPatternIds(): string[] {
  return Object.keys(patterns);
}

/**
 * Check if a pattern ID exists
 */
export function hasPattern(id: string): boolean {
  return id in patterns;
}

export { PatternDefinition, PatternPrompt };
