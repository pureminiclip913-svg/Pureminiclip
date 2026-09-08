import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  // Never expose sensitive keys or internals
  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  // Sanitize message: remove any chance of API key leaking
  let message = err.message || 'An unexpected server error occurred.';
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (apiKey && apiKey.length > 5) {
    message = message.replace(new RegExp(apiKey, 'g'), '[REDACTED_API_KEY]');
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
