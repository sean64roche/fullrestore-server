import Tournament from '../models/Tournament';
import Round from '../models/Round';
import EntrantPlayer from '../models/EntrantPlayer';
import {v4 as uuidv4} from 'uuid';

export interface TournamentAttributes {
    name: string;
    season: number;
    format: string;
    current_round?: number;
    prize_pool?: number;
    individual_winner?: string;
    team_tour?: boolean;
    team_winner?: string;
}

class TournamentService {
    public async createTournament(attrs: TournamentAttributes) {
        try {
            return await Tournament.create({
                id: uuidv4(),
                ...attrs,
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async getAllTournaments(
        format?: string,
        season?: string
    ) {
        const queryOptions: any = { where: {} };
        if (format) queryOptions.where.format = format;
        if (season) queryOptions.where.season = season;

        return await Tournament.findAll(queryOptions);
    }

    public async getTournamentById(id: string) {
        return await Tournament.findByPk(id);
    }

    public async getEntrantsByTournamentId(id: string) {
        return await EntrantPlayer.findAll({
            where: {tournament_id: id},
            order: [['seed', 'ASC']],
        });
    }

    public async getRoundsByTournamentId(id: string) {
        return await Round.findAll({
            where: {tournament_id: id},
            order: [['round', 'ASC']],
        });
    }

    public async updateTournament(
        id: string,
        fieldsToUpdate: Partial<TournamentAttributes>
    ) {
        const [updated] = await Tournament.update(fieldsToUpdate, {
            where: { id },
        });
        if (updated) {
            return await Tournament.findByPk(id);
        }
        return null;
    }

    public async deleteTournament(id: string) {
        return await Tournament.destroy({
            where: {id},
        });
    }

}

export default new TournamentService();