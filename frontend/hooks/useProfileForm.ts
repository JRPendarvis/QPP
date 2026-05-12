import { useState, useCallback } from 'react';

/**
 * Single Responsibility: Manage profile form field state
 * Does not handle API calls, validation, or profile data
 */
export function useProfileForm(initialName: string = '', initialSkillLevel: string = 'beginner') {
  const [name, setName] = useState(initialName);
  const [skillLevel, setSkillLevel] = useState(initialSkillLevel);

  const reset = useCallback((newName: string, newSkillLevel: string) => {
    setName(newName);
    setSkillLevel(newSkillLevel);
  }, []);

  const getFormData = useCallback(() => {
    return { name, skillLevel };
  }, [name, skillLevel]);

  return {
    name,
    setName,
    skillLevel,
    setSkillLevel,
    reset,
    getFormData,
  };
}
