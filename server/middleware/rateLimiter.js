import { rateLimit } from 'express-rate-limit';

export const simulateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: "You've used your 3 simulations for today. Come back tomorrow.",
      retryAfter: 'tomorrow',
    });
  },
});
