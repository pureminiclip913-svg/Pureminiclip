import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    return next(err);
  }

  // Determine appropriate HTTP status and error code
  let statusCode = err.statusCode || err.status || 500;
  let errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  const errStr = String(err.message || '');
  if (
    errStr.includes('HTTP 402') ||
    errStr.includes('insufficient_quota') ||
    errStr.includes('quota_exceeded') ||
    errStr.includes('No credits available') ||
    errStr.includes('exceeds your quota')
  ) {
    statusCode = 402;
    errorCode = 'QUOTA_EXCEEDED';
  } else if (
    errStr.includes('HTTP 401') ||
    errStr.includes('unauthorized') ||
    errStr.includes('Invalid API key')
  ) {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
  }

  // Sanitize message: remove any chance of API key leaking
  let message = err.message || 'An unexpected server error occurred.';
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (apiKey && apiKey.length > 5) {
    message = message.replace(new RegExp(apiKey, 'g'), '[REDACTED_API_KEY]');
  }
  const sarvamKey = process.env.SARVAM_API_KEY;
  if (sarvamKey && sarvamKey.length > 5) {
    message = message.replace(new RegExp(sarvamKey, 'g'), '[REDACTED_API_KEY]');
  }

  console.error(`[API Error ${statusCode}] [${errorCode}]: ${message}`);

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
    },
  });
}
