import {execSync} from "node:child_process";
require('dotenv').config();

const GITLAB_REGISTRY: string = process.env.GITLAB_REGISTRY;
const GITLAB_USERNAME: string = process.env.GITLAB_USERNAME;
const GITLAB_TOKEN: string = process.env.GITLAB_TOKEN;
const POSTGRES_IMAGE_NAME: string = process.env.POSTGRES_IMAGE_NAME;
const POSTGRES_IMAGE_TAG: string = 'latest';

export async function setupDb() {
    try {
        console.log(process.env.NODE_ENV);
        execSync(`docker login ${GITLAB_REGISTRY} -u ${GITLAB_USERNAME} -p ${GITLAB_TOKEN}`, {
            stdio: 'inherit'
        });

        const fullImagePath = `${GITLAB_REGISTRY}/${POSTGRES_IMAGE_NAME}:${POSTGRES_IMAGE_TAG}`;
        execSync(`docker pull ${fullImagePath}`, {
            stdio: 'inherit'
        });

        try {
            execSync('docker stop fullrestore-integration-test', { stdio: 'ignore' });
            execSync('docker rm fullrestore-integration-test', { stdio: 'ignore' });
        } catch {}

        execSync(`docker run -d \
          -e POSTGRES_DB=fullrestore-integration-test \
          -e POSTGRES_PASSWORD=password \
          -p 5433:5432 \
          ${fullImagePath}`, {
            stdio: 'inherit'
        });

        await connectDb();
    } catch (error) {
        console.error('Failed to set up test database:', error);
        throw error;
    }
}

async function connectDb() {
    const { Pool } = require('pg');
    const pool = new Pool({
        host: 'localhost',
        port: 5433,
        database: 'fullrestore-integration-test',
        user: 'postgres',
        password: 'password',
        connectionTimeoutMillis: 5000,
    });

    const maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            await pool.query('SELECT 1');
            console.log('Database is ready');
            return;
        } catch (err) {
            retries++;
            console.log(`Error on connecting: ${err.message}`);
            console.log(`Waiting for database... (Attempt ${retries}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    throw new Error('Could not connect to the database');
}

export async function teardownDb() {
    try {
        execSync('docker stop fullrestore-integration-test-db', { stdio: 'ignore' });
        execSync('docker rm fullrestore-integration-test-db', { stdio: 'ignore' });
    } catch {}
}