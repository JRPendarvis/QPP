import { PatternDefinition, PatternPrompt } from './types';
import * as fs from 'fs';
import * as path from 'path';

const patterns: Record<string, PatternDefinition> = {};

// Auto-discover patterns from subdirectories
const patternsDir = __dirname;
const entries = fs.readdirSync(patternsDir, { withFileTypes: true });

for (const entry of entries) {
  if (entry.isDirectory()) {
    try {
      const patternModule = require(path.join(patternsDir, entry.name));
      const definition: PatternDefinition = patternModule.default || Object.values(patternModule)[0];
      
      if (definition?.id && definition?.template) {
        patterns[definition.id] = definition;
        console.log(`✅ Loaded pattern: ${definition.id}`);
      }
    } catch (e) {
      // Skip folders that aren't valid patterns (e.g., no index.ts)
    }
  }
}

console.log(`📦 Pattern registry: ${Object.keys(patterns).length} patterns loaded`);

export function getPattern(id: string): PatternDefinition | undefined {
  return patterns[id];
}

export function getAllPatterns(): PatternDefinition[] {
  return Object.values(patterns);
}

export function getPatternIds(): string[] {
  return Object.keys(patterns);
}

export { PatternDefinition, PatternPrompt };