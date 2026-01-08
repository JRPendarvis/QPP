// src/patterns/planResolver.ts
import { buildPinwheelPlan, type QuiltSizeIn } from './pinwheel/plan';

export type QuiltPlan = ReturnType<typeof buildPinwheelPlan>;

export function buildPlan(patternId: string, quiltSizeIn: QuiltSizeIn): QuiltPlan {
  switch (patternId) {
    case 'pinwheel':
      return buildPinwheelPlan(quiltSizeIn);
    default:
      throw new Error(`No plan builder registered for patternId: ${patternId}`);
  }
}
