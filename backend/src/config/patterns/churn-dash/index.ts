import { PatternDefinition } from '../../../types/PatternDefinition';
import { CHURN_DASH_TEMPLATE } from './template';
import { CHURN_DASH_PROMPT } from './prompt';
import { createStablePositional } from '../colorAssignmentStrategies';

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
   * Churn Dash - stable positional colors.
   * Background + rails + accent stay in their assigned positions.
   * No rotation across blocks; positions are consistent.
   */
  getColors: createStablePositional
};

export default ChurnDash;
