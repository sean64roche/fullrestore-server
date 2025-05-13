import Tournament from '../models/Tournament';
import Round from '../models/Round';
import EntrantPlayer from '../models/EntrantPlayer';
import {v4 as uuidv4} from 'uuid';

export interface TournamentAttributes {
    name: string;
    season: string | number;
    format: string;
    current_round?: number;
    prize_pool?: number;
    individual_winner?: string;
    team_tour?: boolean;
    team_winner?: string;
    info?: string;
    start_date?: Date;
    end_date?: Date;
}

interface GetTournamentParams {
    name?: string;
    season?: string | number;
    format?: string;
    individual_winner?: string;
    slug: string;
    page: number;
    limit?: number;
}

class TournamentService {
    public async createTournament(attrs: TournamentAttributes) {
        try {
            const slug = toSlug(attrs.name, attrs.season);
            return await Tournament.create({
                id: uuidv4(),
                slug: slug,
                ...attrs,
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async getTournaments(params: GetTournamentParams) {
        const { name, season, format, individual_winner, slug, page, limit } = params;
        const offset = (page - 1) * limit;
        const whereClause: any = {};
        if (name) whereClause.name = name;
        if (season) whereClause.season = season;
        if (format) whereClause.format = format;
        if (individual_winner) whereClause.individual_winner = individual_winner;
        if (slug) whereClause.slug = slug;
        return await Tournament.findAll({
            limit: limit || null,
            offset: offset || null,
            where: {
                ...whereClause
            },
            order: [['createdAt', 'DESC']],
        });
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

    async getRoundsByTournamentSlug(slug: string) {
        const tournament = await Tournament.findOne({
            where: {slug: slug},
        });
        return await Round.findAll({
            where: {tournament_id: tournament.id},
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

export function toSlug(name: string, season: number | string): string {
    return name.toLowerCase().replace(/ /g, '-') +
        (+season === 1 ? '' : '-' + season.toString());
}

export default new TournamentService();
