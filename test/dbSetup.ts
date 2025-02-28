import {exec} from "node:child_process";
import * as util from "node:util";
import path from "node:path";
import {Sequelize} from "sequelize";

const execPromise = util.promisify(exec);
const testDbConfig = {
    database: 'fullrestore-integration-test',
    username: 'postgres',
    password: 'password',
};

export async function setupTestDb() {
    try {
        await execPromise(`dropdb --if-exists ${testDbConfig.database}`);
    } catch (error) {
        console.log('Database not found, creating new...');
    }

    await execPromise(`createdb ${testDbConfig.database}`);

    // Run init.sql on the test database
    const initSqlPath = path.join(__dirname, '../../scripts/fullrestore-database/init.sql');
    await execPromise(`psql -d ${testDbConfig.database} -f ${initSqlPath}`);

    // Connect to the database
    const sequelize = new Sequelize({ ...testDbConfig,
        host: 'localhost',
        port: 5432,
        dialect: 'postgres',
        logging: false
    });
    return sequelize;
}