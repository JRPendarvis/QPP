export type QuiltDimensions = { widthIn: number; heightIn: number };

type QuiltPreset = QuiltDimensions & { promptLabel: string };

/**
 * Shared source of truth for quilt size presets and parsing.
 */
export class QuiltSizeCatalog {
  private static readonly PRESETS: Record<string, QuiltPreset> = {
    baby: { widthIn: 36, heightIn: 52, promptLabel: 'baby quilt' },
    lap: { widthIn: 50, heightIn: 65, promptLabel: 'lap/throw quilt' },
    twin: { widthIn: 66, heightIn: 90, promptLabel: 'twin quilt' },
    full: { widthIn: 80, heightIn: 90, promptLabel: 'full/double quilt' },
    queen: { widthIn: 90, heightIn: 95, promptLabel: 'queen quilt' },
    king: { widthIn: 105, heightIn: 95, promptLabel: 'king quilt' },
    default: { widthIn: 60, heightIn: 72, promptLabel: 'throw quilt' },
  };

  private static readonly DEFAULT_KEY = 'default';

  static tryResolvePreset(input?: string): QuiltPreset | null {
    if (!input) return null;
    const key = input.trim().toLowerCase();
    return this.PRESETS[key] ?? null;
  }

  static tryParseDimensions(input?: string): QuiltDimensions | null {
    if (!input) return null;
    const match = input.match(/(\d+)\s*[×x]\s*(\d+)/i);
    if (!match) return null;

    const widthIn = parseInt(match[1], 10);
    const heightIn = parseInt(match[2], 10);

    if (!Number.isFinite(widthIn) || !Number.isFinite(heightIn) || widthIn <= 0 || heightIn <= 0) {
      return null;
    }

    return { widthIn, heightIn };
  }

  static resolveDimensions(preferredInput?: string, fallbackInput?: string): QuiltDimensions {
    const resolved =
      this.tryResolvePreset(preferredInput) ||
      this.tryParseDimensions(preferredInput) ||
      this.tryParseDimensions(fallbackInput) ||
      this.PRESETS[this.DEFAULT_KEY];

    return { widthIn: resolved.widthIn, heightIn: resolved.heightIn };
  }

  static formatDisplaySize(dimensions: QuiltDimensions): string {
    return `${dimensions.widthIn}×${dimensions.heightIn} inches`;
  }

  static formatPromptSize(input?: string): string {
    const preset = this.tryResolvePreset(input);
    if (preset) {
      return `${preset.widthIn}×${preset.heightIn} inches ${preset.promptLabel}`;
    }

    const custom = this.tryParseDimensions(input);
    if (custom) {
      return `${custom.widthIn}×${custom.heightIn} inches custom quilt`;
    }

    const defaultPreset = this.PRESETS[this.DEFAULT_KEY];
    return `${defaultPreset.widthIn}×${defaultPreset.heightIn} inches ${defaultPreset.promptLabel}`;
  }
}