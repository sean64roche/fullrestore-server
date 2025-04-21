import axios, {AxiosError, AxiosResponse} from "axios";
import {Tournament, TournamentDto, TournamentResponse} from "../interfaces/tournament";
import {ApiConfig} from "../config";
import Repository from "./repository";

export class TournamentRepository extends Repository {

    readonly playersUrl: string;
    readonly tournamentsUrl: string;
    constructor(config: ApiConfig) {
        super(config);
        this.playersUrl = config.baseUrl + config.playersEndpoint;
        this.tournamentsUrl = config.baseUrl + config.tournamentsEndpoint;
    }

    async create(tournament: TournamentDto): Promise<Tournament> {
        try {
            const response: AxiosResponse = await axios.post(this.tournamentsUrl, tournament);
            const { id, name, season, format, current_round, prize_pool, individual_winner } = response.data;
            this.logger.info(`Tournament created with UUID ${id}`);
            return {
                id: id,
                name: name,
                season: season,
                format: format,
                currentRound: current_round,
                prizePool: prize_pool,
                individualWinner: individual_winner,
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.status) {
                    case 409: {
                        const existingTournament: Tournament = await this.getExistingTournament(tournament.name, tournament.season);
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
    async getExistingTournament(existingName: string, existingSeason: number): Promise<Tournament> {
        try {
            const response: AxiosResponse = await axios.get(`${this.tournamentsUrl}?name=${existingName}&season=${existingSeason}`);
            const { id, name, season, format, current_round, prize_pool, individual_winner } = response.data[0];
            this.logger.info(`Tournament found with UUID ${id}`);
            return {
                id: id,
                name: name,
                season: season,
                format: format,
                currentRound: current_round,
                prizePool: prize_pool,
                individualWinner: individual_winner,
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
}

exports.TournamentRepository = TournamentRepository;