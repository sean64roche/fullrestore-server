import { PathLike } from "node:fs";
import fs from "node:fs";
import csv from "csv-parser";
import {SheetData} from "../interfaces/import.js";
import {makeEmptyFieldsNull} from "./helpers.js";
import {Logger} from "./logger.js";

export default class csvParser {
    async load(csvFile: PathLike, logger: Logger): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const rows: SheetData[] = [];
            fs.createReadStream(csvFile)
                .pipe(csv())
                .on("data", (data: SheetData) => {
                    rows.push(data);
                })
                .on("end", () => {
                    logger.info(`Init successful on ${csvFile.toString()}.`);
                    resolve(rows);
                })
                .on("error", (error: Error) => {
                    logger.error("Error reading " + csvFile.toString()  + " - " + error);
                    reject(error);
                });
            for (const row in rows) {
                makeEmptyFieldsNull(row);
            }
        });
    }
}