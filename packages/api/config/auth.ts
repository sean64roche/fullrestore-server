import * as dotenv from 'dotenv';
import {NextFunction, Request, Response} from 'express';

dotenv.config();

export const authenticateKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];

    const validKeys = {
        client: process.env.CLIENT_API_KEY,
        importer: process.env.IMPORTER_API_KEY,
        discord: process.env.DISCORD_API_KEY,
    };

    // Check if provided key matches any valid key
    const isValidKey = Object.values(validKeys).some(key => key && key === apiKey);

    if (!isValidKey) {
        return res.status(401).json({
            error: 'Invalid or missing API key',
            message: 'Include x-api-key header with valid key'
        });
    } else {
        next();
    }
};

module.exports = { authenticateKey };