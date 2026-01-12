const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'Just starting out, learning basic techniques' },
  { value: 'advanced_beginner', label: 'Advanced Beginner', description: 'Comfortable with basics, ready for more' },
  { value: 'intermediate', label: 'Intermediate', description: 'Confident with standard techniques' },
  { value: 'advanced', label: 'Advanced', description: 'Highly skilled, tackles complex projects' },
  { value: 'expert', label: 'Expert', description: 'Master quilter with competition-level skills' },
];

interface SkillLevelSectionProps {
  skillLevel: string;
  onSkillLevelChange: (level: string) => void;
}

export default function SkillLevelSection({ skillLevel, onSkillLevelChange }: SkillLevelSectionProps) {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quilting Experience</h3>
      
      <div>
        <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700 mb-2">
          Your Skill Level
        </label>
        <select
          id="skillLevel"
          value={skillLevel}
          onChange={(e) => onSkillLevelChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
          onFocus={(e) => e.target.style.borderColor = '#2C7A7B'}
          onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
        >
          {SKILL_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label} - {level.description}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-600">
          We'll use this to suggest appropriate quilt patterns for your skill level
        </p>
      </div>
    </div>
  );
}
