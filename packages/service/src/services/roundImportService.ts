import RoundRepository from "../repositories/roundRepository.js";
import CsvParser from "../utils/csvParser.js";
import {RoundEntity, TournamentEntity} from "../interfaces/tournament.js";
import {Logger} from "../utils/logger.js";
import {ApiConfig} from "../config.js";

export class RoundImportService {

    readonly fillerTimestamp: string = "1970-01-01T00:00:00.000Z";
    readonly config: ApiConfig
    readonly logger: Logger;
    constructor(config: ApiConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
    }

    async importRounds(csvPath: string, tournament: TournamentEntity, name?: string, deadline?: string): Promise<Set<RoundEntity>> {
        const rounds: Set<RoundEntity> = new Set();
        const totalRounds: number = (await new CsvParser().load(csvPath, this.logger))[0].rounds;
        let roundNumber: number = 1;
        while (roundNumber <= totalRounds) {
            const roundResponse: RoundEntity = await new RoundRepository(this.config)
                .create(tournament, roundNumber, name, deadline);
            rounds.add(roundResponse);
            roundNumber++;
        }
        return rounds;
    }
}

export default RoundImportService;
