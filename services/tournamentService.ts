import Tournament from '../models/Tournament';
import Round from '../models/Round';
import EntrantPlayer from '../models/EntrantPlayer';
import { v4 as uuidv4 } from 'uuid';

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
            const newTournament = await Tournament.create({
                id: uuidv4(),
                ...attrs,
            });
            return newTournament;
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

        const tournaments = await Tournament.findAll(queryOptions);
        return tournaments;
    }

    public async getTournamentById(id: string) {
        const tournament = await Tournament.findByPk(id);
        return tournament;
    }

    public async getEntrantsByTournamentId(id: string) {
        const entrants = await EntrantPlayer.findAll({
            where: { tournament_id: id },
            order: [['seed', 'ASC']],
        });
        return entrants;
    }

    public async getRoundsByTournamentId(id: string) {
        const rounds = await Round.findAll({
            where: { tournament_id: id },
            order: [['round', 'ASC']],
        });
        return rounds;
    }

    public async updateTournament(
        id: string,
        fieldsToUpdate: Partial<TournamentAttributes>
    ) {
        const [updated] = await Tournament.update(fieldsToUpdate, {
            where: { id },
        });
        if (updated) {
            const tournament = await Tournament.findByPk(id);
            return tournament;
        }
        return null;
    }

    public async deleteTournament(id: string) {
        const deleted = await Tournament.destroy({
            where: { id },
        });
        return deleted;
    }

}

export default new TournamentService();