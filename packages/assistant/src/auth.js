import fetch from 'node-fetch';
import { config } from 'dotenv';

config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'; // Adjust port as needed
const BOT_TOKEN = process.env.BOT_TOKEN;

// Helper function for API requests
async function makeApiRequest(endpoint, method = 'GET', data = null) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BOT_TOKEN}`
            },
            ...(data && { body: JSON.stringify(data) })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

export default makeApiRequest;