import axios, {AxiosResponse} from "axios";
import {RoundBye} from "../interfaces/pairing";
import {EntrantPlayer} from "../interfaces/player";
import {Round} from "../interfaces/tournament";
import {Logger} from "../utils/logger";
import Repository from "./repository";
import {ApiConfig} from "../config";

class RoundByeRepository extends Repository {

    readonly roundByesUrl: string;
    constructor(config: ApiConfig, logger: Logger) {
        super(config, logger);
        this.roundByesUrl = config.baseUrl + config.roundByesEndpoint;
    }

    async create(round: Round, entrantPlayer: EntrantPlayer): Promise<RoundBye | undefined> {
        const username = entrantPlayer.player.spreadsheetAlias?.psAlias || entrantPlayer.player.psUser;
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
                    throw new Error(error.message);
            }
        }
    }
}

export default RoundByeRepository;
