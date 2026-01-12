import { Response } from 'express';

function isDev(): boolean {
  return process.env.NODE_ENV !== 'production';
}

function toErrDebug(error: unknown) {
  if (!isDev()) return undefined;

  const e = error as any;
  return {
    name: e?.name,
    message: e?.message,
    stack: e?.stack,
  };
}

export class PatternErrorHandler {
  static handleGenerationError(error: unknown, res: Response): Response {
    console.error('Pattern generation error:', error);

    // Known semantic errors
    if (error instanceof Error) {
      if (error.message === 'USER_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          ...(isDev() ? { debug: toErrDebug(error) } : {}),
        });
      }
      if (error.message === 'SUBSCRIPTION_EXPIRED') {
        return res.status(403).json({
          success: false,
          message: 'Your subscription has expired. Please renew to generate patterns.',
          ...(isDev() ? { debug: toErrDebug(error) } : {}),
        });
      }
      if (error.message === 'GENERATION_LIMIT_REACHED') {
        return res.status(403).json({
          success: false,
          message: "You've reached your monthly generation limit. Upgrade your plan for more!",
          ...(isDev() ? { debug: toErrDebug(error) } : {}),
        });
      }
    }

    // Friendly fallback mapping
    let message = 'Failed to generate quilt pattern. Please try again.';
    if (error instanceof Error) {
      if (error.message.includes('high demand') || error.message.includes('experiencing')) {
        message = error.message;
      } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        message = 'Pattern generation timed out. Please try again with fewer images.';
      } else if (error.message.includes('rate limit')) {
        message = 'Service is busy. Please wait a moment and try again.';
      }
    }

    return res.status(500).json({
      success: false,
      message,
      ...(isDev() ? { debug: toErrDebug(error) } : {}),
    });
  }

  static handleDownloadError(error: unknown, res: Response): Response {
    console.error('Download pattern error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to download pattern. Please try again.',
      ...(isDev() ? { debug: toErrDebug(error) } : {}),
    });
  }

  static handleGenericError(error: unknown, res: Response, action: string): Response {
    console.error(`${action} error:`, error);
    return res.status(500).json({
      success: false,
      message: `Failed to ${action.toLowerCase()}`,
      ...(isDev() ? { debug: toErrDebug(error) } : {}),
    });
  }
}
