import React from 'react';
import { SKILL_LEVELS, getPatternsForSkillLevel, formatFabricRange } from '../app/helpers/patternHelpers';

interface PatternSelectorProps {
  patternChoice: 'auto' | 'manual';
  setPatternChoice: (choice: 'auto' | 'manual') => void;
  selectedPattern: string;
  setSelectedPattern: (patternId: string) => void;
  challengeMe: boolean;
  setChallengeMe: (checked: boolean) => void;
  currentSkill: string;
  targetSkill: string;
}

const PatternSelector: React.FC<PatternSelectorProps> = ({
  patternChoice,
  setPatternChoice,
  selectedPattern,
  setSelectedPattern,
  challengeMe,
  setChallengeMe,
  currentSkill,
  targetSkill,
}) => {
  const availablePatterns = getPatternsForSkillLevel(targetSkill)
    .slice()
    .sort((a: { id: string; name: string }, b: { id: string; name: string }) => a.name.localeCompare(b.name));

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
            onChange={() => {
              setPatternChoice('auto');
              setSelectedPattern('');
            }}
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
            onChange={() => setPatternChoice('manual')}
            className="mt-1 mr-3"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 mb-2">
              I&apos;ll Choose My Pattern
            </div>
            {patternChoice === 'manual' && (
              <select
                value={selectedPattern}
                onChange={(e) => setSelectedPattern(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a pattern...</option>
                {availablePatterns.map((patternOption: { id: string; name: string; minFabrics: number; maxFabrics: number }) => (
                  <option key={patternOption.id} value={patternOption.id}>
                    {patternOption.name}
                    {patternOption.minFabrics && patternOption.maxFabrics &&
                      ` (Best with ${formatFabricRange(patternOption.minFabrics, patternOption.maxFabrics)})`
                    }
                  </option>
                ))}
              </select>
            )}
          </div>
        </label>
      </div>
      {/* Challenge Me Checkbox */}
      <label className="flex items-center cursor-pointer p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <input
          type="checkbox"
          checked={challengeMe}
          onChange={(e) => setChallengeMe(e.target.checked)}
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
};

export default PatternSelector;
