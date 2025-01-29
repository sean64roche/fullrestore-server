import RoundRepository from "../repositories/roundRepository";
import CsvParser from "../utils/csvParser";
import {Round, Tournament} from "../interfaces/tournament";
import {Logger} from "../utils/logger";
import {ApiConfig} from "../config";

export class RoundImportService {

    readonly fillerTimestamp: string = "1970-01-01T00:00:00.000Z";
    readonly config: ApiConfig
    readonly logger: Logger;
    constructor(config: ApiConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
    }

    async importRounds(csvPath: string, tournament: Tournament, name?: string, deadline?: string): Promise<Set<Round>> {
        const rounds: Set<Round> = new Set();
        const totalRounds: number = (await new CsvParser().load(csvPath, this.logger))[0].rounds;
        let roundNumber: number = 1;
        while (roundNumber <= totalRounds) {
            const roundResponse: Round = await new RoundRepository(this.config, this.logger)
                .create(tournament, roundNumber, name, deadline);
            rounds.add(roundResponse);
            roundNumber++;
        }
        return rounds;
    }
}

export default RoundImportService;
