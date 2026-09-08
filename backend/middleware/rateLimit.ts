import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute per IP
const ipRequests = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequests.entries()) {
    if (now > record.resetTime) {
      ipRequests.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  // Allow health check and audio streaming without strict rate limiting
  if (req.path === '/api/health' || req.path.startsWith('/api/audio')) {
    next();
    return;
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  let record = ipRequests.get(ip);

  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + WINDOW_MS };
    ipRequests.set(ip, record);
    next();
    return;
  }

  record.count += 1;
  if (record.count > MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please slow down and try again in a minute.',
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      },
    });
    return;
  }

  next();
}
