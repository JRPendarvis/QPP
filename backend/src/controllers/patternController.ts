import { Request, Response } from 'express';
import { ClaudeService } from '../services/claudeService';
import { PrismaClient } from '@prisma/client';

const claudeService = new ClaudeService();
const prisma = new PrismaClient();

const NEXT_LEVEL: Record<string, string> = {
  beginner: 'advanced_beginner',
  advanced_beginner: 'intermediate',
  intermediate: 'advanced',
  advanced: 'expert',
  expert: 'expert',
};

export class PatternController {
  // POST /api/patterns/generate
  async generatePattern(req: Request, res: Response) {
    try {
      const { fabrics, skillLevel, challengeMe } = req.body;
      const userId = req.user?.userId;

      // Validate input
      if (!fabrics || !Array.isArray(fabrics) || fabrics.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Please provide at least 2 fabric images',
        });
      }

      if (fabrics.length > 8) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 8 fabric images allowed',
        });
      }

      // Validate fabrics are base64 strings
      const validFabrics = fabrics.every(
        (fabric: any) => typeof fabric === 'string' && fabric.length > 0
      );

      if (!validFabrics) {
        return res.status(400).json({
          success: false,
          message: 'Invalid fabric data format',
        });
      }

      // Determine target skill level
      let targetSkillLevel = skillLevel || 'beginner';
      
      if (challengeMe && targetSkillLevel !== 'expert') {
        targetSkillLevel = NEXT_LEVEL[targetSkillLevel] || targetSkillLevel;
      }

      // Generate pattern using Claude
      const pattern = await claudeService.generateQuiltPattern(fabrics, targetSkillLevel);

      res.status(200).json({
        success: true,
        message: 'Pattern generated successfully',
        data: pattern,
      });

    } catch (error) {
      console.error('Pattern generation error:', error);
      
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to generate pattern',
        });
      }
    }
  }
}