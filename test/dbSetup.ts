import { setupDb, teardownDb } from "./dbScript";

let isSetup = false;
let isRunning = false;

export async function globalSetup() {
    if (!isSetup && !isRunning) {
        isRunning = true;
        await setupDb();
        isSetup = true;
        isRunning = false;
    }
    return isSetup;
}

export async function globalTeardown() {
    if (isSetup) {
        isSetup = false;
        isRunning = true;
        await teardownDb();
        isRunning = false;
    }
}

process.on('exit', () => {
    if (isSetup) {
        console.log('Process exiting, cleanup might be incomplete');
    }
});