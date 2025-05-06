import RoundByeRepository from "../repositories/roundByeRepository";
import CsvParser from "../utils/csvParser";
import {RoundEntity} from "../interfaces/tournament";
import {EntrantPlayerEntity} from "../interfaces/player";
import {RoundByeEntity, SheetBye} from "../interfaces/pairing";
import {Logger} from "../utils/logger";
import {ApiConfig} from "../config";

export class RoundByeImportService {

    readonly config: ApiConfig;
    readonly logger: Logger;
    constructor(config: ApiConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
    }

    async importByes(csvPath: string, rounds: Set<RoundEntity>, entrantPlayers: Set<EntrantPlayerEntity>): Promise<Set<RoundByeEntity>> {
        const records: SheetBye[] = await new CsvParser().load(csvPath, this.logger);
        const roundByes: Set<RoundByeEntity> = new Set();
        for (const record of records) {
            const round: RoundEntity | undefined = Array.from(rounds).find(round => +record.round === round.roundNumber);
            if (!round) {
                const msg: string = `FATAL: invalid value provided for tournament rounds as ${record.round}`;
                this.logger.error(msg);
                throw new Error(msg);
            }
            const entrantPlayer: EntrantPlayerEntity | undefined = Array.from(entrantPlayers).find(entrant => entrant.player.Aliases.find(alias => alias.psAlias === record.player));
            if (!entrantPlayer) {
                const msg = `FATAL: Player '${record.player}' not identifiable`;
                this.logger.error(msg);
                throw new Error(msg)
            }
            const response: RoundByeEntity | undefined = await new RoundByeRepository(this.config)
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
