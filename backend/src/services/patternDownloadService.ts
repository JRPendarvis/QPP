import { DownloadRepository, UserDownloadData, PatternDownloadData } from '../repositories/downloadRepository';
import { DownloadValidator, DownloadValidationResult } from '../services/downloadValidator';

export interface UserDownloadValidation {
  canDownload: boolean;
  error?: {
    statusCode: number;
    message: string;
    currentUsage?: number;
    limit?: number;
  };
}

/**
 * Service coordinating pattern download operations
 * Single Responsibility: Orchestrate download validation and recording
 * Delegates to DownloadRepository (data) and DownloadValidator (business logic)
 */
export class PatternDownloadService {
  private downloadRepository: DownloadRepository;
  private downloadValidator: DownloadValidator;

  constructor() {
    this.downloadRepository = new DownloadRepository();
    this.downloadValidator = new DownloadValidator();
  }

  /**
   * Validate user can download a pattern
   */
  async validateDownload(
    userId: string,
    patternId: string
  ): Promise<{ user: UserDownloadData | null; pattern: PatternDownloadData | null; validation: DownloadValidationResult }> {
    // Fetch user and pattern data
    const user = await this.downloadRepository.getUserDownloadData(userId);
    const pattern = user ? await this.downloadRepository.getUserPattern(patternId, userId) : null;

    // Validate download eligibility
    const validation = this.downloadValidator.validateDownload(user, pattern);

    return { user, pattern, validation };
  }

  /**
   * Record pattern download
   */
  async recordDownload(userId: string, patternId: string, isFirstDownload: boolean): Promise<void> {
    if (!isFirstDownload) return;

    await this.downloadRepository.recordDownload(userId, patternId);
  }

  /**
   * Generate PDF filename from pattern data
   */
  generateFileName(patternData: any): string {
    return `${patternData.patternName.replace(/[^a-z0-9]/gi, '_')}.pdf`;
  }
}
