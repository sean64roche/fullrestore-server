import axios, { AxiosError, AxiosResponse } from "axios";
import {
    PlayerDto,
    Player,
    EntrantPlayer,
    EntrantPlayerResponse,
    transformEntrantPlayerResponse
} from "../interfaces/player";
import {Tournament} from "../interfaces/tournament";
import {cleanPsUsername} from "../utils/helpers";
import {Logger} from "../utils/logger";
import {ApiConfig} from "../config";
import Repository from "./repository";

class PlayerRepository extends Repository {

    readonly playersUrl: string;
    readonly playerAliasesUrl: string;
    readonly entrantPlayersUrl: string;
    constructor(config: ApiConfig, logger: Logger) {
        super(config, logger);
        this.playersUrl = config.baseUrl + config.playersEndpoint;
        this.playerAliasesUrl = config.baseUrl + config.playerAliasesEndpoint;
        this.entrantPlayersUrl = config.baseUrl + config.entrantPlayersEndpoint;
    }

    async createPlayer(player: PlayerDto): Promise<Player> {
        try {
            const response: AxiosResponse = await axios.post(this.playersUrl, {
                ps_user: player.ps_user,
                discord_user: player.discord_user,
                discord_id: player.discord_id,
            });
            this.logger.info(`Player '${player.ps_user}' created with UUID ${response.data.id}`);
            return {
                ...response.data,
                spreadsheetAlias: {
                    psAlias: cleanPsUsername(player.ps_user).toLowerCase()
                }
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.status) {
                    case 409:
                        this.logger.error(`FATAL: Alias ${player.ps_user} already exists on another player`);
                        throw new AxiosError(error.message);
                    case 404:
                        const msg404: string = `Error 404: Not found on ${this.playersUrl}`;
                        this.logger.error(msg404);
                        throw new AxiosError(msg404);
                    default:
                        this.logger.error(`FATAL on creating Player: ${error.message}`);
                        throw new AxiosError(error.message);
                }
            } else {
                this.logger.error(`FATAL on creating Player: ${error.message}`);
                throw new Error(error.message);
            }
        }
    }

    async createEntrantPlayer(player: Player, tournament: Tournament): Promise<EntrantPlayer> {
        try {
            const response: AxiosResponse = await axios.post(this.entrantPlayersUrl, {
                player_id: player.id,
                tournament_id: tournament.id
            });
            const { id, entrant_team_id, active, max_round, seed } = response.data;
            return {
                id: id,
                player: player,
                tournament: tournament,
                entrantTeam: entrant_team_id,
                active: active,
                maxRound: max_round,
                seed: seed
            };
        } catch (error) {
            switch (error.status) {
                case 409:
                    const username: string = player.spreadsheetAlias?.psAlias || player.psUser;
                    this.logger.warn(`WARNING: player '${username}' already has entrant record`);
                    throw (error);
                default:
                    this.logger.error(`FATAL on creating entrant player: ${error.message}`);
                    throw new Error(error.message);
            }
        }
    }

    async findPlayer(alias: string): Promise<Player | null> {
        try {
            const response: AxiosResponse = await axios.get(`${this.playerAliasesUrl}/${alias}`);
            const { ps_user, discord_user, discord_id } = response.data.Player;
            const { player_id, ps_alias } = response.data;
            return {
                id: player_id,
                psUser: ps_user,
                discordUser: discord_user,
                discordId: discord_id,
                spreadsheetAlias: {
                    psAlias: ps_alias,
                }
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 404:
                        this.logger.info(`Player '${alias} not found`);
                        return null;
                    default:
                        const msg: string = `FATAL on findPlayer: ${JSON.stringify(error.response?.data)}`
                        this.logger.error(msg);
                        throw (error);
                }
            } else {
                this.logger.error(`FATAL on findPlayer: ${error.message}`);
                throw new Error(error.message);
            }

        }
    }

    async getEntrantPlayer(player: Player, tournament: Tournament): Promise<EntrantPlayer> {
        try {
            const response: AxiosResponse = await axios.get(`${this.entrantPlayersUrl}?player_id=${player.id}&tournament_id=${tournament.id}`);
            const { id, entrant_team_id, active, max_round, seed } = response.data[0];
            return {
                id: id,
                tournament: tournament,
                player: player,
                entrantTeam: entrant_team_id,
                active: active,
                maxRound: max_round,
                seed: seed,
            }
        } catch (error) {
            this.logger.error(`FATAL on getEntrantPlayer: ${JSON.stringify(error.response?.data)}`);
            throw new Error(error.message);
        }
    }

    async findEntrantPlayerByPlayerId(playerId: string): Promise<EntrantPlayer | void> {
        try {
            const response: AxiosResponse = await axios.get(`${this.entrantPlayersUrl}?player_id=${playerId}`);
            const data: EntrantPlayerResponse = response.data[0];
            if (data === undefined) return;
            else return transformEntrantPlayerResponse(data);
        }
        catch (error) {
            this.logger.error(`FATAL on getEntrantPlayer: ${JSON.stringify(error.response?.data)}`);
            throw new Error(error.message);
        }
    }
}

export default PlayerRepository;
