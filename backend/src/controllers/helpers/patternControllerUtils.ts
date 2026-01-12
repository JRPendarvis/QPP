export function safeCount(v: unknown): number | 'n/a' {
  return Array.isArray(v) ? v.length : 'n/a';
}

export function isDev(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export interface RequestDebugInfo {
  userIdPresent: boolean;
  imagesCount: number | 'n/a';
  typesCount: number | 'n/a';
  selectedPattern?: string;
  skillLevel?: string;
}

export function logPatternGenerationRequest(body: any): void {
  console.log('🧾 /api/patterns/generate keys:', Object.keys(body));
  console.log('📸 Images count:', safeCount(body.fabricImages || body.fabrics), 'Types count:', safeCount(body.fabricTypes || []));
  console.log('📋 Raw selectedPattern:', body.selectedPattern);
  console.log('🧩 roleAssignments present:', body.roleAssignments ? 'yes' : 'no');
}

export function buildDebugInfo(
  userId: string | undefined,
  images: any,
  imageTypes: any,
  selectedPattern?: string,
  skillLevel?: string
): RequestDebugInfo | undefined {
  if (!isDev()) return undefined;

  return {
    userIdPresent: !!userId,
    imagesCount: safeCount(images),
    typesCount: safeCount(imageTypes),
    selectedPattern,
    skillLevel,
  };
}
