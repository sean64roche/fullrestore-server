import RoundByeRepository from "../repositories/roundByeRepository";
import CsvParser from "../utils/csvParser";
import {Round} from "../interfaces/tournament";
import {EntrantPlayer} from "../interfaces/player";
import {RoundBye, SheetBye} from "../interfaces/pairing";
import {Logger} from "../utils/logger";
import {ApiConfig} from "../config";

export class RoundByeImportService {

    readonly config: ApiConfig;
    readonly logger: Logger;
    constructor(config: ApiConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
    }

    async importByes(csvPath: string, rounds: Set<Round>, entrantPlayers: Set<EntrantPlayer>): Promise<Set<RoundBye>> {
        const records: SheetBye[] = await new CsvParser().load(csvPath, this.logger);
        const roundByes: Set<RoundBye> = new Set();
        for (const record of records) {
            const round: Round | undefined = Array.from(rounds).find(round => +record.round === round.roundNumber);
            if (!round) {
                const msg: string = `FATAL: invalid value provided for tournament rounds as ${record.round}`;
                this.logger.error(msg);
                throw new Error(msg);
            }
            const entrantPlayer: EntrantPlayer | undefined = Array.from(entrantPlayers).find(entrant => entrant.player.psUser);
            if (!entrantPlayer) {
                const msg = `FATAL: Player '${record.player}' not identifiable`;
                this.logger.error(msg);
                throw new Error(msg)
            }
            const response: RoundBye | undefined = await new RoundByeRepository(this.config)
                .create(round, entrantPlayer);
            if (!!response) {
                roundByes.add(response);
                this.logger.info(`Bye added with UUID ${response.id}`);
            }
        }
        return roundByes;
    }
}

export default RoundByeImportService;
