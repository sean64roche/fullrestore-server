import axios, {AxiosResponse} from "axios";
import {RoundByeEntity} from "../interfaces/pairing.js";
import {EntrantPlayerEntity} from "../interfaces/player.js";
import {RoundEntity} from "../interfaces/tournament.js";
import Repository from "./repository.js";
import {ApiConfig} from "../config.js";

export default class RoundByeRepository extends Repository {

    readonly roundByesUrl: string;
    constructor(config: ApiConfig) {
        super(config);
        this.roundByesUrl = config.baseUrl + config.roundByesEndpoint;
    }

    async create(round: RoundEntity, entrantPlayer: EntrantPlayerEntity): Promise<RoundByeEntity | undefined> {
        const username = entrantPlayer.player.psUser;
        try {
            const response: AxiosResponse = await axios.post(this.roundByesUrl, {
                round_id: round.id,
                entrant_player_id: entrantPlayer.id,
            });
            const { id, round_id, entrant_player_id } = response.data;
            this.logger.info(`Bye created for entrant ${username} with UUID ${id}`);
            return {
                id: id,
                round: round,
                entrantPlayer: entrantPlayer,
            }
        } catch (error) {
            switch (error.status) {
                case 409:
                    this.logger.warn(`WARNING: Bye already exists for ${username} in round ${round.roundNumber}`);
                    return undefined;
                default:
                    this.logger.error(`FATAL on creating RoundBye: ${error.message}`);
                    throw new Error(error.response?.data || error.message);
            }
        }
    }
}

exports.RoundByeRepository = RoundByeRepository;