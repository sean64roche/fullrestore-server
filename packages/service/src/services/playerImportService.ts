import CsvLoader from "../utils/csvParser.js";
import {cleanPsUsername, makeEmptyFieldsNull, validateDiscordUsername} from "../utils/helpers.js";
import PlayerRepository from "../repositories/playerRepository.js";
import {
    EntrantPlayerEntity,
    PlayerEntity,
    SheetPlayer,
} from "../interfaces/player.js";
import {TournamentEntity} from "../interfaces/tournament.js";
import {Logger} from "../utils/logger.js";
import {ApiConfig} from "../config.js";

export class PlayerImportService {

    readonly config: ApiConfig;
    readonly logger: Logger;
    constructor(config: ApiConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
    }

    async importPlayers(csvPath: string): Promise<Set<PlayerEntity>> {
        const players: Set<PlayerEntity> = new Set();
        const records: SheetPlayer[] = await new CsvLoader().load(csvPath, this.logger);

        for (const record of records) {
            const cleanPsUser: string = cleanPsUsername(record.showdown_user).toLowerCase();
            if (!!record.discord_user) validateDiscordUsername(record.discord_user, this.logger);
            const existingPlayer: PlayerEntity | null =  await new PlayerRepository(this.config)
                .findPlayerByAlias(cleanPsUser);
            if (!!existingPlayer) {
                players.add(existingPlayer);
                if (existingPlayer.psUser === cleanPsUser) {
                    this.logger.info(`Alias ${cleanPsUser} found in database, skipping`);
                } else {
                    this.logger.warn(`Alias ${cleanPsUser} already exists as ${existingPlayer.psUser}, skipping`);
                }
                continue;
            }
            makeEmptyFieldsNull(record);
            const playerResponse: PlayerEntity = await new PlayerRepository(this.config)
                .createPlayer({
                    ps_user: cleanPsUser,
                    discord_user: record.discord_user?.toLowerCase(),
                    discord_id: record.discord_id,
            });
            players.add(playerResponse);
            this.logger.info(`Player added as '${cleanPsUser}'`);
        }
        return players;
    }

    async importEntrantPlayers(players: Set<PlayerEntity>, tournament: TournamentEntity): Promise<Set<EntrantPlayerEntity>> {
        const entrantPlayers: Set<EntrantPlayerEntity> = new Set();
        for (const player of players) {
            try {
                const response: EntrantPlayerEntity = await new PlayerRepository(this.config)
                    .createEntrantPlayer(player, tournament);
                entrantPlayers.add(response);
                this.logger.info(`Entrant '${player.psUser}' added with UUID ${response.id}`);
            } catch (error) {
                if (error.status === 409) {
                    const existingEntrantPlayer: EntrantPlayerEntity | void = await new PlayerRepository(this.config)
                        .findEntrant(player, tournament);
                    entrantPlayers.add(existingEntrantPlayer!);
                    this.logger.warn(`WARNING: duplicate entry found with UUID ${existingEntrantPlayer!.id}`);
                } else {
                    throw (error);
                }
            }

        }
        return entrantPlayers;
    }
}

export default PlayerImportService;
