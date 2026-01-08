// src/config/patterns/pinwheel/instructionCapability.ts

import type { InstructionCapability } from '../../../services/instructions/types';
import buildPinwheelPlan, { type PinwheelPlan } from './plan';
import { renderPinwheelInstructions } from './renderPinwheelInstructions';

export const pinwheelInstructionCapability: InstructionCapability<PinwheelPlan> = {
  patternId: 'pinwheel',

  buildPlan: buildPinwheelPlan,

  renderInstructions: (plan, fabricsByRole) => {
    const background = fabricsByRole.background ?? 'Background fabric';
    const primary = fabricsByRole.primary ?? 'Primary fabric';
    const secondary = fabricsByRole.secondary ?? primary;
    const accent = fabricsByRole.accent ?? primary;

    return renderPinwheelInstructions(plan, {
      background,
      primary,
      secondary,
      accent,
    });
  },
};
