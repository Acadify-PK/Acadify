import rateLimit from "express-rate-limit";

// Primary limiter for all API requests
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Strict limiter for sensitive auth endpoints (Login/Register)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login/register attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts, please try again after an hour",
  },
});

// Moderate limiter for interaction endpoints (Comments/Reviews)
export const interactionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limit to 20 interactions per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "You are doing that too often. Please wait a few minutes.",
  },
});
