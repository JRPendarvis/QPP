export const CREDIT_ALERT_THRESHOLDS = [50, 25, 10, 5] as const;

export const UNIQUE_ROLE_LABELS = ['Background', 'Primary', 'Secondary', 'Accent'] as const;

export const UNIQUE_SPLIT_SEED = [0.45, 0.3, 0.15, 0.1] as const;

export const UNIQUE_SIZE_CATALOG = [
  { key: 'baby', label: 'baby', width: 36, height: 52 },
  { key: 'lap', label: 'lap', width: 50, height: 65 },
  { key: 'default', label: 'default', width: 60, height: 72 },
  { key: 'twin', label: 'twin', width: 66, height: 90 },
  { key: 'full', label: 'full', width: 80, height: 90 },
  { key: 'queen', label: 'queen', width: 90, height: 95 },
  { key: 'king', label: 'king', width: 105, height: 95 },
] as const;
