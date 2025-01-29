import axios, {AxiosError, AxiosResponse} from "axios";
import {Pairing, PairingDto, Replay, ReplayDto} from "../interfaces/pairing";
import {EntrantPlayer} from "../interfaces/player";
import {Round} from "../interfaces/tournament";
import {Logger} from "../utils/logger";
import {ApiConfig} from "../config";
import Repository from "./repository";

class PairingRepository extends Repository {

    private readonly fillerTimestamp: string = "1970-01-01T00:00:00.000Z";
    readonly pairingsUrl: string;
    readonly replaysUrl: string;
    constructor(config: ApiConfig, logger: Logger) {
        super(config, logger);
        this.pairingsUrl = config.baseUrl + config.pairingsEndpoint;
        this.replaysUrl = config.baseUrl + config.replaysEndpoint;
    }

    async createPairing(
        round: Round,
        entrantPlayer1: EntrantPlayer,
        entrantPlayer2: EntrantPlayer,
        winner?: EntrantPlayer
    ): Promise<Pairing> {
        this.logger.info(`INFO: attempting to send Pairing DTO`);
        const playerAlias1: string = entrantPlayer1.player.spreadsheetAlias.psAlias;
        const playerAlias2: string = entrantPlayer2.player.spreadsheetAlias.psAlias;
        const winnerAlias: string | undefined = winner?.player.spreadsheetAlias.psAlias;
        const pairingDto: PairingDto = {
            round_id: round.id,
            entrant1_id: entrantPlayer1.id,
            entrant2_id: entrantPlayer2.id,
            time_scheduled: this.fillerTimestamp,
            time_completed: this.fillerTimestamp,
            winner_id: winner?.id,
        }
        try {
            const response: AxiosResponse = await axios.post(this.pairingsUrl, pairingDto);
            const { id, round_id, entrant1_id, entrant2_id, time_scheduled, time_completed, winner_id } = response.data;
            this.logger.info(`Pairing ${playerAlias1} vs ${playerAlias2} created with UUID ${response.data.id}`);
            return {
                id: id,
                round: round,
                entrant1: entrantPlayer1,
                entrant2: entrantPlayer2,
                winner: winner,
                scheduledAt: time_scheduled,
                completedAt: time_completed,
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 409:
                        const existingPairing: Pairing | null = await this.getPairing(
                            round,
                            entrantPlayer1,
                            entrantPlayer2,
                        );
                        if (!!existingPairing
                            && (existingPairing.round.id === round.id)
                            && (existingPairing.entrant1.id === entrantPlayer1.id)
                            && (existingPairing.entrant2.id === entrantPlayer2.id)
                            && (existingPairing.winner?.id === winner?.id)
                        ) {
                            this.logger.warn(`Pairing ${playerAlias1} vs ${playerAlias2} exists on round ${round.roundNumber}`);
                            this.logger.info(`Pairing UUID is ${JSON.stringify(existingPairing.id)}`);
                            return existingPairing;
                        } else if (existingPairing) {
                            await this.deletePairing(existingPairing.id);
                            this.logger.error(`FATAL: ${playerAlias1} vs ${playerAlias2} conflicts with another pairing in round ${round.roundNumber}`);
                            this.logger.error(`The conflict pairing and its associated replays have been removed from the server`);
                            throw (error);
                        } else {
                            this.logger.error(`FATAL: unrecoverable conflict on createPairing '${playerAlias1}' vs '${playerAlias2}': ${JSON.stringify(error)}`);
                            throw (error);
                        }
                    default:
                        this.logger.error(`FATAL on creating pairing '${playerAlias1}' vs '${playerAlias2}': ${error.message}`);
                        throw (error);
                }
            } else {
                this.logger.error(`FATAL on creating pairing '${playerAlias1}' vs '${playerAlias2}': ${error.message}`);
                throw new Error(error.message);
            }
        }
    }

    async getPairing(round: Round, player1: EntrantPlayer, player2: EntrantPlayer): Promise<Pairing | null> {
        try {
            const response: AxiosResponse = await axios.get(`${this.pairingsUrl}?round_id=${round.id}&player=${player1.player.spreadsheetAlias.psAlias}`);
            const { id, round_id, entrant1_id, entrant2_id, time_scheduled, time_completed, winner_id } = response.data[0];
            const winner: EntrantPlayer = player1.id === winner_id ? player1 : player2;
            return {
                id: id,
                round: round,
                entrant1: player1,
                entrant2: player2,
                winner: winner,
                scheduledAt: time_scheduled,
                completedAt: time_completed,
            };
        } catch (error) {
            this.logger.error(`FATAL on getPairing: ${JSON.stringify(error.response?.data)}`);
            throw new Error(error.message);
        }
    }

    async deletePairing(pairing_id: string): Promise<void> {
        try {
            const response: AxiosResponse = await axios.delete(`${this.pairingsUrl}/${pairing_id}`);
            return response.data;
        } catch (error) {
            this.logger.error(`FATAL on deletePairing: ${JSON.stringify(error.response?.data)}`);
            throw new Error(error.message);
        }
    }

    async createReplay(pairing: Pairing, sheetUrl: string, sheetMatchNumber: number): Promise<Replay | undefined> {
        const replayDto: ReplayDto = {
            pairing_id: pairing.id,
            url: sheetUrl,
            match_number: sheetMatchNumber,
        }
        try {
            const response: AxiosResponse = await axios.post(this.replaysUrl, replayDto);
            const { url, pairing_id, match_number } = response.data;
            this.logger.info(`Replay created, URL is ${url}`);
            return {
              pairing: pairing,
              url: url,
              matchNumber: match_number,
            };
        } catch (error) {
            switch (error.status) {
                case 409:
                    const existingReplay: Replay = await this.getReplay(pairing, sheetUrl, sheetMatchNumber);
                    this.logger.info(`Existing UUID: ${existingReplay.pairing.id},
                        request UUID: ${pairing.id},
                        existing match number: ${existingReplay.matchNumber},
                        request match number: ${sheetMatchNumber}
                    `);
                    if (existingReplay.pairing.id === pairing.id && existingReplay.matchNumber === sheetMatchNumber) {
                        this.logger.info(`Replay already found, URL is ${sheetUrl}`);
                        break;
                    } else {
                        this.logger.error(`FATAL: replay ${sheetUrl} already exists with different parameters: ${JSON.stringify(error.response.data)}`);
                        throw (error);
                    }
                default:
                    this.logger.error(`FATAL on createReplay:\n${JSON.stringify(error.response?.data)}`);
                    throw new Error(error.message);
            }
        }
    }

    async getReplay(pairing: Pairing, sheetUrl: string, sheetMatchNumber?: number): Promise<Replay> {
        try {
            const response: AxiosResponse = await axios.get(`${this.replaysUrl}?url=${sheetUrl}`);
            const { url, pairing_id, match_number } = response.data[0];
            return {
                pairing: pairing,
                url: url,
                matchNumber: match_number,
            };
        } catch (error) {
            this.logger.error(`FATAL on getReplay: ${JSON.stringify(error.response?.data)}`);
            throw new Error(error.message);
        }
    }
}

export default PairingRepository;