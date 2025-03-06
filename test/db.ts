import {setupDb, teardownDb} from "./dbScript";

require('dotenv').config();

async function createTestDb() {
    console.log('Starting setup for db...');
    try {
        await setupDb();
        console.log('db setup successful.');
        console.log('Press Ctrl + C to teardown.');
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('tearing down db...');
        await teardownDb();
        console.log('teardown successful.');
    } catch (error) {
        console.error('db setup failed:', error);
    }
}

createTestDb().catch(console.error);