import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const JWT_SECRET = process.env.JWT_SECRET;
const BOT_API_KEY = process.env.BOT_API_KEY;

// Middleware to verify JWT tokens
export const authenticateToken = (req, res, next) => {
    // Allow all GET requests to pass through
    if (req.method === 'GET') {
        return next();
    }

    // Check for bot API key
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === BOT_API_KEY) {
        return next();
    }

    // Verify JWT for other requests
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Generate JWT token
export const generateToken = (userId, role) => {
    return jwt.sign(
        { 
            userId,
            role,
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Login endpoint handler
export const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Here you would typically verify credentials against your database
        // For example:
        // const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        // const validPassword = await bcrypt.compare(password, user.password);
        
        // For demonstration, we'll assume validation passed
        const token = generateToken('user123', 'admin');
        res.json({ token });
    } catch (error) {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};