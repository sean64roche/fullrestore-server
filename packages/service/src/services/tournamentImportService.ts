import CsvLoader from "../utils/csvParser.js";
import FormatRepository from "../repositories/formatRepository.js";
import PlayerRepository from "../repositories/playerRepository.js";
import TournamentRepository from "../repositories/tournamentRepository.js";
import {SheetTournament, TournamentEntity, TournamentDto} from "../interfaces/tournament.js";
import {PlayerEntity} from "../interfaces/player.js";
import {makeEmptyFieldsNull} from "../utils/helpers.js";
import {Logger} from "../utils/logger.js";
import {ApiConfig} from "../config.js";

export class TournamentImportService {

    readonly config: ApiConfig;
    readonly logger: Logger;
    constructor(config: ApiConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
    }

    async importTournament(csvPath: string): Promise<TournamentEntity> {
        const tournamentData: SheetTournament[] = await new CsvLoader().load(csvPath, this.logger);
        if (tournamentData.length > 1) {
            this.logger.error(`No uploading more than 1 tournament at a time. It's rude.`);
            throw new Error("UploadingMoreThanOneTournamentAtATimeError");
        }
        const tournament: TournamentDto = tournamentData[0];
        if (!!tournament.individual_winner) {
            const winner: PlayerEntity | null = await new PlayerRepository(this.config).findPlayerByAlias(tournament.individual_winner);
            tournament.individual_winner = winner?.id;
        } else {
            this.logger.warn(`WARNING: tournament winner not matched to a player ID`);
        }
        this.logger.info("Processing format...");
        const formatRepository = new FormatRepository(this.config);
        await formatRepository.create(tournament.format);
        makeEmptyFieldsNull(tournament);
        return await new TournamentRepository(this.config).create({
            ...tournament
        });
    }
}

export default TournamentImportService;
