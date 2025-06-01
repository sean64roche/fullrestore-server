import axios, { AxiosError, AxiosResponse } from "axios";
import {
    PairingEntity,
    PairingDto,
    PairingResponse,
    ReplayEntity,
    ReplayDto,
    ReplayResponse,
    transformReplayResponse,
    transformPairingResponse,
    ReplayJson,
    PSJson,
    LogJson,
    ContentResponse,
    ContentEntity,
    ContentDto, transformContentResponse,
} from "../interfaces/pairing.js";
import { EntrantPlayerEntity } from "../interfaces/player.js";
import { RoundEntity } from "../interfaces/tournament.js";
import { ApiConfig } from "../config.js";
import Repository from "./repository.js";

export default class PairingRepository extends Repository {

    private readonly fillerTimestamp: string = "1970-01-01T00:00:00.000Z";
    readonly pairingsUrl: string;
    readonly replaysUrl: string;
    readonly contentUrl: string;
    constructor(config: ApiConfig) {
        super(config);
        this.pairingsUrl = config.baseUrl + config.pairingsEndpoint;
        this.replaysUrl = config.baseUrl + config.replaysEndpoint;
        this.contentUrl = config.baseUrl + config.contentEndpoint;
    }

    async createPairing(
        round: RoundEntity,
        entrantPlayer1: EntrantPlayerEntity,
        entrantPlayer2: EntrantPlayerEntity,
        winner?: EntrantPlayerEntity
    ): Promise<PairingEntity> {
        this.logger.info(`INFO: attempting to send Pairing DTO`);
        const playerAlias1: string = entrantPlayer1.player.psUser;
        const playerAlias2: string = entrantPlayer2.player.psUser;
        const winnerAlias: string | undefined = winner?.player.psUser;
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
                        const existingPairing: PairingEntity | null = await this.getPairing(
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
                        this.logger.error(`FATAL on creating pairing '${playerAlias1}' vs '${playerAlias2}': ${JSON.stringify(error.response?.data)}`);
                        throw new Error(error.response?.data);
                }
            } else {
                this.logger.error(`FATAL on creating pairing '${playerAlias1}' vs '${playerAlias2}': ${error.message}`);
                throw new Error(JSON.stringify(error.response?.data) || error.message);
            }
        }
    }

    async getPairing(round: RoundEntity, player1: EntrantPlayerEntity, player2: EntrantPlayerEntity): Promise<PairingEntity | null> {
        const username1: string = player1.player.psUser;
        try {
            const response: AxiosResponse = await axios.get(`${this.pairingsUrl}?round_id=${round.id}&player=${username1}`);
            const { id, round_id, entrant1_id, entrant2_id, time_scheduled, time_completed, winner_id } = response.data[0];
            const winner: EntrantPlayerEntity = player1.id === winner_id ? player1 : player2;
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
            this.logger.error(
                `FATAL on getPairing: ${JSON.stringify(error.response?.data  || error.message)} ` +
                `| Request: ${this.pairingsUrl}?round_id=${round.id}&player=${username1}`
            );
            throw new Error(JSON.stringify(error.response?.data) || error.message);
        }
    }

    async deletePairing(pairing_id: string): Promise<void> {
        try {
            const response: AxiosResponse = await axios.delete(`${this.pairingsUrl}/${pairing_id}`);
            return response.data;
        } catch (error) {
            this.logger.error(
                `FATAL on deletePairing: ${JSON.stringify(error.response?.data) || error.message} ` +
                `| Request: ${this.pairingsUrl}/${pairing_id}`
            );
            throw new Error(JSON.stringify(error.response?.data) || error.message);
        }
    }

    async createReplay(pairing: PairingEntity, sheetMatchNumber: number, sheetUrl?: string, sheetLog?: ReplayJson): Promise<ReplayEntity | undefined> {
        const replayDto: ReplayDto = {
            pairing_id: pairing.id,
            match_number: sheetMatchNumber,
            url: sheetUrl,
            json: sheetLog,
        }
        try {
            const response: AxiosResponse = await axios.post(this.replaysUrl, replayDto);
            const replay: ReplayResponse = response.data;
            if (!!replay.url) this.logger.info(`Replay created, URL is ${replay.url}`);
            else this.logger.info(`Replay created using a battle log`);
            return transformReplayResponse(replay);
        } catch (error) {
            switch (error.status) {
                case 409:
                    const existingReplay: ReplayEntity = await this.getReplay(pairing, sheetMatchNumber, sheetUrl, sheetLog);
                    this.logger.warn(
                        `WARNING: Replay ${existingReplay.pairingId},`
                    )
                    this.logger.info(`Existing UUID: ${existingReplay.pairingId},
                        request UUID: ${pairing.id},
                        existing match number: ${existingReplay.matchNumber},
                        request match number: ${sheetMatchNumber}
                    `);
                    if (existingReplay.pairingId === pairing.id && existingReplay.matchNumber === sheetMatchNumber) {
                        const message: string = !!sheetUrl ? `Replay already found, URL is ${sheetUrl}` : `Replay already found, key is { id: ${existingReplay.pairingId}, match_number: ${existingReplay.matchNumber} }`;
                        this.logger.info(message);
                        break;
                    } else {
                        const message: string = !!sheetUrl
                            ?
                            `FATAL: replay ${sheetUrl} already exists with different parameters: ${JSON.stringify(error.response.data)}`
                            :
                            `FATAL: replay already exists, key is { id: ${existingReplay.pairingId}, match_number: ${existingReplay.matchNumber} }`
                        this.logger.error(message);
                        throw (error);
                    }
                default:
                    this.logger.error(
                        `FATAL on createReplay: ${JSON.stringify(error.response?.data) || error.message} ` +
                        `| Request: ${this.replaysUrl} | Body: ${JSON.stringify(replayDto)}`
                    );
                    throw new Error(JSON.stringify(error.response?.data) || error.message);
            }
        }
    }

    async getReplay(pairing: PairingEntity, sheetMatchNumber?: number, sheetUrl?: string, sheetLog?: LogJson): Promise<ReplayEntity> {
        try {
            const response: AxiosResponse = await axios.get(`${this.replaysUrl}?url=${sheetUrl}`);
            return transformReplayResponse(response.data[0]);
        } catch (error) {
            this.logger.error(`FATAL on getReplay: ${JSON.stringify(error.response?.data)}`);
            throw new Error(JSON.stringify(error.response?.data) || error.message);
        }
    }

    async getByRoundId(roundId: string): Promise<PairingEntity[]> {
        try {
            const response: AxiosResponse = await axios.get(`${this.pairingsUrl}?round_id=${roundId}`);
            const pairings: PairingEntity[] = [];
            response.data.forEach((pairing: PairingResponse) => {
                pairings.push(transformPairingResponse(pairing));
            });
            return pairings;
        } catch (error) {
            this.logger.error(
                `FATAL on getByRoundId: ${JSON.stringify(error.response?.data) || error.message} ` +
                ` | Request: ${this.pairingsUrl}?round_id=${roundId}`
            );
            throw new Error(JSON.stringify(error.response?.data) || error.message);
        }
    }

    async getReplaysById(pairingId: string): Promise<ReplayEntity[]> {
        try {
            const response: AxiosResponse = await axios.get(`${this.replaysUrl}?pairing_id=${pairingId}`);
            const replays: ReplayEntity[] = [];
            response.data.forEach((replay: ReplayResponse) => {
                replays.push(transformReplayResponse(replay));
            });
            return replays;
        } catch (error) {
            this.logger.error(
                `FATAL on getReplaysById: ${JSON.stringify(error.response?.data) || error.message} ` +
                `| Request: ${this.replaysUrl}?pairing_id=${pairingId}`
            );
            throw new Error(JSON.stringify(error.response?.data) || error.message);
        }
    }
    async get(pairingId: string): Promise<PairingEntity> {
        try {
            const response: AxiosResponse = await axios.get(`${this.pairingsUrl}/${pairingId}`);
            return transformPairingResponse(response.data);
        } catch (error) {
            this.logger.error(
                `FATAL on get: ${JSON.stringify(error.response?.data || error.message)} ` +
                `| Request: ${this.pairingsUrl}/${pairingId}`);
            throw new Error(JSON.stringify(error.response?.data) || error.message);
        }
    }

    async fetchPairing(roundId: string, playerPsUser: string): Promise<PairingEntity> {
        try {
            const response: AxiosResponse = await axios.get(`${this.pairingsUrl}?round_id=${roundId}&player=${playerPsUser}`);
            return transformPairingResponse(response.data[0]);
        }  catch (error) {
            this.logger.error(
                `FATAL on fetchPairing: ${JSON.stringify(error.response?.data || error.message)} ` +
                `| Request: ${this.pairingsUrl}?round_id=${roundId}&player=${playerPsUser}`
            );
            throw new Error(JSON.stringify(error.response?.data) || error.message);
        }
    }

    async createContent(pairing: PairingEntity, url: string): Promise<ContentEntity> {
        const contentDto: ContentDto = {
            pairing_id: pairing.id,
            content: url,
        }
        try {
            const response: AxiosResponse = await axios.post(this.contentUrl, contentDto);
            const content: ContentResponse = response.data;
            this.logger.info(`
            Content ${content.content} added for 
            ${pairing.entrant1.player.username} vs. ${pairing.entrant2.player.username}, 
            round ${pairing.round.roundNumber}
            `);
            return transformContentResponse(content);
        } catch (error) {
            switch (error.status) {
                case 409:
                    const message: string = `FATAL: content ${url} already exists on another pairing`;
                    this.logger.error(message);
                    throw new Error(message);
                default:
                    this.logger.error(`FATAL on createContent: ${JSON.stringify(error.response?.data) || error.message}`);
                    throw new Error(JSON.stringify(error.response?.data) || error.message);
            }
        }
    }
}