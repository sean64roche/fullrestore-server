import {Logger} from "./logger.js";

export function cleanDiscordUsername(input: string): string {
    return input.replace(/[^a-zA-Z0-9._]/g, '');
}
export function cleanPsUsername(input: string): string {
    return input.replace(/[^a-zA-Z0-9]/g, '');
}

export function makeEmptyFieldsNull(object: any): void {
    Object.keys(object).forEach(function(key: string) {
        if (object[key] === "") object[key] = null;
    });
}

export function validateDiscordUsername(username: string, logger: Logger): void {
        if (username.toLowerCase() !== cleanDiscordUsername(username).toLowerCase()) {
            logger.error(`FATAL: Discord username '${username}' is invalid`);
            throw Error(username);
    }
}