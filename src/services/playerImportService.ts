import CsvLoader from "../utils/csvParser";
import {cleanPsUsername, validateDiscordUsername} from "../utils/helpers";
import PlayerRepository from "../repositories/playerRepository";
import {
    EntrantPlayer,
    Player,
    SheetPlayer,
} from "../interfaces/player";
import {Tournament} from "../interfaces/tournament";
import {Logger} from "../utils/logger";
import {ApiConfig} from "../config";

export class PlayerImportService {

    readonly config: ApiConfig;
    readonly logger: Logger;
    constructor(config: ApiConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
    }

    async importPlayers(csvPath: string): Promise<Set<Player>> {
        const players: Set<Player> = new Set();
        const records: SheetPlayer[] = await new CsvLoader().load(csvPath, this.logger);

        for (const record of records) {
            const cleanPsUser: string = cleanPsUsername(record.showdown_user).toLowerCase();
            if (!!record.discord_user) validateDiscordUsername(record.discord_user, this.logger);
            const existingPlayer: Player | null =  await new PlayerRepository(this.config, this.logger)
                .findPlayerByAlias(cleanPsUser);
            if (!!existingPlayer) {
                players.add(existingPlayer);
                this.logger.info(`Alias ${cleanPsUser} already exists, skipping`);
                continue;
            }
            const playerResponse: Player = await new PlayerRepository(this.config, this.logger)
                .createPlayer({
                    ps_user: cleanPsUser,
                    discord_user: record.discord_user?.toLowerCase(),
                    discord_id: record.discord_id,
            });
            players.add(playerResponse);
            this.logger.info(`Player added as '${playerResponse.spreadsheetAlias!.psAlias}'`);
        }
        return players;
    }

    async importEntrantPlayers(players: Set<Player>, tournament: Tournament): Promise<Set<EntrantPlayer>> {
        const entrantPlayers: Set<EntrantPlayer> = new Set();
        for (const player of players) {
            try {
                const response: EntrantPlayer = await new PlayerRepository(this.config, this.logger)
                    .createEntrantPlayer(player, tournament);
                entrantPlayers.add(response);
                this.logger.info(`Entrant '${player.spreadsheetAlias!.psAlias}' added with UUID ${response.id}`);
            } catch (error) {
                if (error.status === 409) {
                    const existingEntrantPlayer: EntrantPlayer = await new PlayerRepository(this.config, this.logger)
                        .getEntrantPlayer(player, tournament);
                    entrantPlayers.add(existingEntrantPlayer);
                    this.logger.warn(`WARNING: duplicate entry found with UUID ${existingEntrantPlayer.id}`);
                } else {
                    throw (error);
                }
            }

        }
        return entrantPlayers;
    }
}

export default PlayerImportService;
