import {connectDb, setupLocalDb, teardownDb} from "./dbScript";
import child_process from "node:child_process";

let isSetup = false;
let isRunning = false;

export async function globalSetup() {
    if (!isSetup && !isRunning) {
        isRunning = true;
        if (!!process.env.CI_ENV) {
            await connectDb('postgres', 5432);
        } else {
            await setupLocalDb();
            await connectDb();
        }
        child_process.execSync(`npx sequelize-cli db:migrate --env test --config config/config.js`, { cwd: '../migration', stdio: 'inherit' });
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