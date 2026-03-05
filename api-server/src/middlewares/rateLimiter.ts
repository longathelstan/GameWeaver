import rateLimit from 'express-rate-limit';

// General API rate limit: 100 requests per 15 minutes per IP
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again after 15 minutes.',
    },
});

// Strict limit for AI-powered endpoints: 15 requests per minute per IP
export const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many AI requests, please slow down and try again after a minute.',
    },
});
