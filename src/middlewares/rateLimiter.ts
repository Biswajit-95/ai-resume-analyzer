import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config';

const rateLimiter = new RateLimiterMemory({
  points: env.REQUESTS_PER_MINUTE,
  duration: 60,
});

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/health') return next();

  rateLimiter
    .consume(req.ip ?? '')
    .then(() => next())
    .catch(() => {
      res.status(429).json({ error: 'Too many requests' });
    });
};

export { rateLimiterMiddleware as rateLimiter };
