import { PatternChoice, PatternDetails } from '../types';
import { formatFabricRange, SKILL_LEVELS } from '../../uploadUtils';

interface PatternSelectionSectionProps {
  patternChoice: PatternChoice;
  onPatternChoiceChange: (choice: PatternChoice) => void;
  selectedPattern: string;
  onSelectedPatternChange: (pattern: string) => void;
  availablePatterns: PatternDetails[];
  selectedPatternDetails: PatternDetails | null;
  fabricsLength: number;
  fabricCountValid: boolean;
  challengeMe: boolean;
  onChallengeMeChange: (checked: boolean) => void;
  targetSkill: string;
  currentSkill: string;
}

export function PatternSelectionSection({
  patternChoice,
  onPatternChoiceChange,
  selectedPattern,
  onSelectedPatternChange,
  availablePatterns,
  selectedPatternDetails,
  fabricsLength,
  fabricCountValid,
  challengeMe,
  onChallengeMeChange,
  targetSkill,
  currentSkill,
}: PatternSelectionSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Step 1: Choose Your Pattern Style
      </h2>

      {/* Pattern Choice Radio Buttons */}
      <div className="space-y-4 mb-6">
        <label className="flex items-start cursor-pointer">
          <input
            type="radio"
            name="patternChoice"
            value="auto"
            checked={patternChoice === 'auto'}
            onChange={() => onPatternChoiceChange('auto')}
            className="mt-1 mr-3"
          />
          <div>
            <div className="font-medium text-gray-900">
              Let QuiltPlannerPro Choose
            </div>
            <div className="text-sm text-gray-600">
              Our AI will pick the best pattern for your skill level and number of fabrics
            </div>
          </div>
        </label>

        <label className="flex items-start cursor-pointer">
          <input
            type="radio"
            name="patternChoice"
            value="manual"
            checked={patternChoice === 'manual'}
            onChange={() => onPatternChoiceChange('manual')}
            className="mt-1 mr-3"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 mb-2">
              I&apos;ll Choose My Pattern
            </div>

            {patternChoice === 'manual' && (
              <>
                <select
                  value={selectedPattern}
                  onChange={(e) => onSelectedPatternChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a pattern...</option>
                  {availablePatterns.map((patternOption) => (
                    <option key={patternOption.id} value={patternOption.id}>
                      {patternOption.name} ({formatFabricRange(patternOption.minFabrics, patternOption.maxFabrics)})
                    </option>
                  ))}
                </select>

                {/* Pattern requirements badge */}
                {selectedPatternDetails && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center text-blue-800">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{selectedPatternDetails.name}</span>
                    </div>
                    <p className="mt-1 text-sm text-blue-700">
                      Requires {formatFabricRange(selectedPatternDetails.minFabrics, selectedPatternDetails.maxFabrics)}
                      {fabricsLength > 0 && (
                        <span className={`ml-2 font-medium ${fabricCountValid ? 'text-green-600' : 'text-red-600'}`}>
                          (you have {fabricsLength})
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </label>
      </div>

      {/* Challenge Me Checkbox */}
      <label className="flex items-center cursor-pointer p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <input
          type="checkbox"
          checked={challengeMe}
          onChange={(e) => onChallengeMeChange(e.target.checked)}
          className="mr-3 h-5 w-5 text-indigo-600"
        />
        <div>
          <div className="font-medium text-indigo-900">
            🚀 Challenge Me
          </div>
          <div className="text-sm text-indigo-700">
            Use {SKILL_LEVELS[targetSkill]} level complexity
            {challengeMe && currentSkill !== 'expert' && (
              <span className="ml-1 font-semibold">(one level up!)</span>
            )}
          </div>
        </div>
      </label>
    </div>
  );
}