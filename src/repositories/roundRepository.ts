import axios, {AxiosError, AxiosResponse} from "axios";
import {Round, RoundDto, Tournament} from "../interfaces/tournament";
import {ApiConfig} from "../config";
import Repository from "./repository";

export class RoundRepository extends Repository {

    private fillerTimestamp: string = "1970-01-01T00:00:00.000Z";
    readonly roundsUrl: string;
    constructor(config: ApiConfig) {
        super(config);
        this.roundsUrl = config.baseUrl + config.roundsEndpoint;
    }

    async create(reqTournament: Tournament, reqRoundNumber: number, reqName?: string, reqDeadline?: string): Promise<Round> {
        try {
            const roundDto: RoundDto = {
                tournament_id: reqTournament.id,
                round: reqRoundNumber,
                name: reqName,
                deadline: reqDeadline || this.fillerTimestamp,
            }
            const response: AxiosResponse = await axios.post(this.roundsUrl, roundDto);
            const { id, tournament_id, round, name, deadline } = response.data;
            this.logger.info(`Round ${round} created with UUID ${id}`);
            return {
                id: id,
                tournament: round.tournament,
                roundNumber: round,
                name: name,
                deadline: deadline,
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.status) {
                    case 409:
                        const existingRound: Round = await this.get(reqTournament, reqRoundNumber);
                        this.logger.warn(`WARNING: Round ${existingRound.roundNumber} already exists`);
                        return existingRound;
                    default:
                        this.logger.error(`FATAL on RoundRepository.create: ${JSON.stringify(error.response?.data)}`);
                        throw (error);
                }
            } else {
                this.logger.error(`FATAL: on RoundRepository.create: ${error.message}`);
                throw new Error(error.message);
            }
        }
    }

    async get(tournament: Tournament, roundNumber: number): Promise<Round> {
        try {
            const response: AxiosResponse = await axios.get(`${this.roundsUrl}?tournament_id=${tournament.id}&round=${roundNumber}`);
            const { id, tournament_id, round, name, deadline } = response.data[0];
            return {
                id: id,
                tournament: tournament,
                roundNumber: round,
                name: name,
                deadline: deadline,
            };
        } catch (error) {
            this.logger.error(`FATAL on Round get: ${JSON.stringify(error.response?.data)}`);
            throw new Error(error.message);
        }
    }
}

exports.roundRepository = RoundRepository;