import CsvLoader from "../utils/csvParser";
import FormatRepository from "../repositories/formatRepository";
import PlayerRepository from "../repositories/playerRepository";
import TournamentRepository from "../repositories/tournamentRepository";
import {SheetTournament, Tournament, TournamentDto} from "../interfaces/tournament";
import {Player} from "../interfaces/player";
import {makeEmptyFieldsNull} from "../utils/helpers";
import {Logger} from "../utils/logger";
import {ApiConfig} from "../config";

export class TournamentImportService {

    readonly config: ApiConfig;
    readonly logger: Logger;
    constructor(config: ApiConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
    }

    async importTournament(csvPath: string): Promise<Tournament> {
        const tournamentData: SheetTournament[] = await new CsvLoader().load(csvPath, this.logger);
        if (tournamentData.length > 1) {
            this.logger.error(`No uploading more than 1 tournament at a time. It's rude.`);
            throw new Error("UploadingMoreThanOneTournamentAtATimeError");
        }
        const tournament: TournamentDto = tournamentData[0];
        if (!!tournament.individual_winner) {
            const winner: Player | null = await new PlayerRepository(this.config, this.logger).findPlayer(tournament.individual_winner);
            tournament.individual_winner = winner?.id;
        } else {
            this.logger.warn(`WARNING: tournament winner not matched to a player ID`);
        }
        this.logger.info("Processing format...");
        const formatRepository = new FormatRepository(this.config, this.logger);
        await formatRepository.create(tournament.format);
        makeEmptyFieldsNull(tournament);
        return await new TournamentRepository(this.config, this.logger).create({
            ...tournament
        });
    }
}

export default TournamentImportService;
