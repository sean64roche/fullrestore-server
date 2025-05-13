import axios, {AxiosError, AxiosResponse} from "axios";
import {
    TournamentEntity,
    TournamentDto,
    TournamentResponse,
    transformTournamentResponse, RoundEntity, RoundResponse, transformRoundResponse
} from "../interfaces/tournament.js";
import {ApiConfig} from "../config.js";
import Repository from "./repository.js";

export default class TournamentRepository extends Repository {

    readonly playersUrl: string;
    readonly tournamentsUrl: string;
    constructor(config: ApiConfig) {
        super(config);
        this.playersUrl = config.baseUrl + config.playersEndpoint;
        this.tournamentsUrl = config.baseUrl + config.tournamentsEndpoint;
    }

    async create(tournament: TournamentDto): Promise<TournamentEntity> {
        try {
            const response: AxiosResponse = await axios.post(this.tournamentsUrl, tournament);
            const { id, name, season, format, start_date, finish_date, current_round, prize_pool, individual_winner, info, slug } = response.data;
            this.logger.info(`Tournament created with UUID ${id}`);
            return {
                id: id,
                name: name,
                season: season,
                format: format,
                startDate: start_date,
                finishDate: finish_date,
                currentRound: current_round,
                prizePool: prize_pool,
                individualWinner: individual_winner,
                info: info,
                slug: slug,
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.status) {
                    case 409: {
                        const existingTournament: TournamentEntity = await this.getExistingTournament(tournament.name, tournament.season);
                        this.logger.warn(`'${tournament.name}' already exists: tournament_id is ${existingTournament.id}`);
                        return existingTournament;
                    }
                    case 404:
                        this.logger.error(`Error 404: Not found on ${this.playersUrl}`);
                        throw error;
                    default:
                        this.logger.error(`FATAL on tournamentRepository: ${JSON.stringify(error.response?.data)}`);
                        throw error;
                }
            } else {
                throw new Error(`FATAL on tournamentRepository.create: ${error.message}`);
            }
        }
    }
    async getExistingTournament(existingName: string, existingSeason: number): Promise<TournamentEntity> {
        try {
            const response: AxiosResponse = await axios.get(`${this.tournamentsUrl}?name=${existingName}&season=${existingSeason}`);
            const { id, name, season, format, start_date, finish_date, current_round, prize_pool, individual_winner, info, slug } = response.data[0];
            this.logger.info(`Tournament found with UUID ${id}`);
            return {
                id: id,
                name: name,
                season: season,
                format: format,
                startDate: start_date,
                finishDate: finish_date,
                currentRound: current_round,
                prizePool: prize_pool,
                individualWinner: individual_winner,
                info: info,
                slug: slug,
            };
        } catch (error) {
            this.logger.error(`FATAL on getExistingTournament: ${JSON.stringify(error.response?.data)}`);
            throw new Error(`FATAL on getExistingTournament: ${JSON.stringify(error.response?.data)}`);
        }
    }
    async fetchTournaments(page: number = 1, limit: number = 10): Promise<TournamentResponse[]> {
        try {
            const response: AxiosResponse = await axios.get(`${this.tournamentsUrl}?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            this.logger.error(`FATAL on fetchTournaments: ${JSON.stringify(error.response?.data)}`);
            throw new Error(`FATAL on fetchTournaments: ${JSON.stringify(error.response?.data)}`);
        }
    }

    async getBySlug(slug: string): Promise<TournamentEntity> {
        try {
            const response: AxiosResponse = await axios.get(`${this.tournamentsUrl}?slug=${slug}`);
            return transformTournamentResponse(response.data[0]);
        } catch (error) {
            this.logger.error(`FATAL on getBySlug: ${JSON.stringify(error.response?.data)}`);
            throw new Error(`FATAL on getBySlug: ${JSON.stringify(error.response?.data)}`);
        }    }

    async getRoundsBySlug(slug: string): Promise<RoundEntity[]> {
        try {
            const response: AxiosResponse = await axios.get(`${this.tournamentsUrl}/${slug}/rounds`);
            const rounds: RoundEntity[] = [];
            response.data.forEach((round: RoundResponse) => {
                rounds.push(transformRoundResponse(round));
            });
            return rounds;
        } catch (error) {
            this.logger.error(`FATAL on getRoundsBySlug: ${JSON.stringify(error.response?.data)}`);
            throw new Error(`FATAL on getRoundsBySlug: ${JSON.stringify(error.response?.data)}`);
        }
    }
}