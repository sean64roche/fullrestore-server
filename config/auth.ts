import dotenv from 'dotenv';

dotenv.config();

const BOT_JWT_TOKEN = process.env.BOT_JWT_TOKEN;
const ADMIN_JWT_TOKEN = process.env.ADMIN_JWT_TOKEN;

export const authenticateToken = (req, res, next) => {
    // Allow all GET requests to pass through
    // if (req.method === 'GET') {
    //     return next();
    // }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token required' });
    }

    if (token === BOT_JWT_TOKEN || token === ADMIN_JWT_TOKEN) {
        next();
    } else {
        return res.status(403).json({ error: 'Invalid token' });
    }
};