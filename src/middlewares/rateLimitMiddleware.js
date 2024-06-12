const rateLimit = require('express-rate-limit');

const rateLimitMiddleware = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    handler: (req, res) => {
        return res.status(409).json({ message: "Too many requests, please try again later." });
    },
});

module.exports = rateLimitMiddleware;