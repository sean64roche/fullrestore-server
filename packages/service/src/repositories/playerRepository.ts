import axios, { AxiosError, AxiosResponse } from "axios";
import {
    PlayerDto,
    PlayerEntity,
    EntrantPlayerEntity,
    EntrantPlayerResponse,
    transformEntrantPlayerResponse,
    PlayerResponse,
    transformPlayerResponse,
} from "../interfaces/player.js";
import {TournamentEntity} from "../interfaces/tournament.js";
import {ApiConfig} from "../config.js";
import Repository from "./repository.js";

export default class PlayerRepository extends Repository {

    readonly playersUrl: string;
    readonly playerAliasesUrl: string;
    readonly entrantPlayersUrl: string;
    constructor(config: ApiConfig) {
        super(config);
        this.playersUrl = config.baseUrl + config.playersEndpoint;
        this.playerAliasesUrl = config.baseUrl + config.playerAliasesEndpoint;
        this.entrantPlayersUrl = config.baseUrl + config.entrantPlayersEndpoint;
    }

    async createPlayer(player: PlayerDto): Promise<PlayerEntity> {
        try {
            const response: AxiosResponse = await axios.post(this.playersUrl, player);
            const playerData: PlayerResponse = {
                ...response.data,
                Aliases: [
                    {
                        alias: player.ps_user
                    }
                ]
            };
            this.logger.info(`Player '${player.ps_user}' created with UUID ${playerData.id}`);
            return transformPlayerResponse(playerData);
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
                        throw new AxiosError(error.response?.data);
                }
            } else {
                this.logger.error(`FATAL on creating Player: ${error.message}`);
                throw new Error(error.message);
            }
        }
    }

    async createEntrantPlayer(player: PlayerEntity, tournament: TournamentEntity): Promise<EntrantPlayerEntity> {
        try {
            const response: AxiosResponse = await axios.post(this.entrantPlayersUrl, {
                player_id: player.id,
                tournament_id: tournament.id
            });
            const entrantData: EntrantPlayerResponse = {
                ...response.data,
                Player: player,
                Tournament: tournament,
            };
            return transformEntrantPlayerResponse(entrantData);
        } catch (error) {
            switch (error.status) {
                case 409:
                    const username: string = player.psUser;
                    this.logger.warn(`WARNING: player '${username}' already has entrant record`);
                    throw (error);
                default:
                    this.logger.error(`FATAL on creating entrant player: ${error.message}`);
                    throw new Error(error.response?.data || error.message);
            }
        }
    }

    async findPlayerByAlias(alias: string): Promise<PlayerEntity | null> {
        try {
            const response: AxiosResponse = await axios.get(`${this.playersUrl}?player=${alias}`);
            return transformPlayerResponse(response.data);
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 404:
                        this.logger.info(`Player '${alias}' not found`);
                        return null;
                    default:
                        const msg: string = `FATAL on findPlayer: ${JSON.stringify(error.response?.data)}`
                        this.logger.error(msg);
                        throw (error);
                }
            } else {
                this.logger.error(`FATAL on findPlayer: ${error.message}`);
                throw new Error(error.response?.data || error.message);
            }

        }
    }

    async findEntrant(player: PlayerEntity, tournament: TournamentEntity): Promise<EntrantPlayerEntity> {
        try {
            const entrant: EntrantPlayerEntity = await this.findEntrantById(player.id, tournament.id);
            if (!entrant) {
                throw new Error(`Entrant not found with UUID ${player.id}`);
            }
            return entrant;
        } catch (error) {
            this.logger.error(`FATAL on getEntrantPlayer: ${JSON.stringify(error.response?.data)}`);
            throw error;
        }
    }

    async findEntrantById(playerId: string, tournamentId: string): Promise<EntrantPlayerEntity> {
        try {
            const response: AxiosResponse = await axios.get(`${this.entrantPlayersUrl}?player_id=${playerId}&tournament_id=${tournamentId}`);
            const data: EntrantPlayerResponse = response.data[0];
            if (!data) {
                const error = new Error(`ERROR: entrantPlayer not found with UUID ${playerId}`);
                this.logger.error(error.message);
                throw error;
            }
            return transformEntrantPlayerResponse(data);
        }
        catch (error) {
            this.logger.error(`FATAL on findEntrantPlayerById: ${JSON.stringify(error.response?.data)}`);
            throw error;
        }
    }

    async fetchPlayer(player: string):  Promise<PlayerEntity> {
        try {
            const response: AxiosResponse = await axios.get(`${this.playersUrl}?player=${player}`);
            return transformPlayerResponse(response.data);
        } catch (error) {
            this.logger.error(`FATAL on fetchPlayer: ${error.message}`);
            throw new Error(error.response?.data || error.message);
        }
    }
}