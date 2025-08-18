import Tournament from '../models/Tournament';
import Round from '../models/Round';
import EntrantPlayer from '../models/EntrantPlayer';
import {Op} from "sequelize";
import Player from "../models/Player";
import PlayerAlias from "../models/PlayerAlias";

export interface TournamentAttributes {
    name: string;
    season: string | number;
    format: string;
    winner_first_to: string;
    current_round?: number;
    prize_pool?: number;
    individual_winner?: string;
    team_tour?: boolean;
    team_winner?: string;
    info?: string;
    start_date?: Date;
    end_date?: Date;
    elimination: number;
    signup_start_date?: Date;
    signup_finish_date?: Date;
    admin_snowflake?: string;
    signup_snowflake?: string;
    result_snowflake?: string;
    role_snowflake?: string;
}

interface GetTournamentParams {
    name?: string;
    season?: string | number;
    format?: string;
    individual_winner?: string;
    slug: string;
    admin_snowflake?: string;
    signup_snowflake?: string;
    result_snowflake?: string;
    role_snowflake?: string;
    page?: number;
    limit?: number;
}

class TournamentService {
    public async createTournament(attrs: TournamentAttributes) {
        try {
            const slug = toSlug(attrs.name, attrs.season);
            return await Tournament.create({
                slug: slug,
                ...attrs,
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async getTournaments(params: GetTournamentParams) {
        const {
            name,
            season,
            format,
            individual_winner,
            slug,
            admin_snowflake,
            signup_snowflake,
            result_snowflake,
            role_snowflake,
            page,
            limit
        } = params;
        const offset = (page - 1) * limit;
        const whereClause: any = {};
        if (name) whereClause.name = name;
        if (season) whereClause.season = season;
        if (format) whereClause.format = format;
        if (individual_winner) whereClause.individual_winner = individual_winner;
        if (slug) whereClause.slug = slug;
        if (admin_snowflake) whereClause.admin_snowflake = admin_snowflake;
        if (signup_snowflake) whereClause.signup_snowflake = signup_snowflake;
        if (result_snowflake) whereClause.result_snowflake = result_snowflake;
        if (role_snowflake) whereClause.role_snowflake = role_snowflake;
        return await Tournament.findAll({
            limit: limit || null,
            offset: offset || null,
            where: {
                ...whereClause
            },
            order: [['createdAt', 'DESC']],
        });
    }


    public async getTournamentById(slug: string) {
        return await Tournament.findByPk(slug);
    }

    public async getEntrantsByTournamentSlug(slug: string) {
        return await EntrantPlayer.findAll({
            where: {tournament_slug: slug},
            order: [['seed', 'ASC']],
            include: [{
                model: Player,
                include: [{
                    model: PlayerAlias,
                    as: 'Aliases',
                    required: false
                }]
            }, {
                model: Tournament,
            }]
        });
    }

    public async getRoundsByTournamentSlug(slug: string) {
        const tournament = await Tournament.findOne({
            where: {slug: slug},
        });
        return await Round.findAll({
            where: {tournament_slug: tournament.slug},
            order: [['round', 'ASC']],
            include: Tournament,
        });
    }

    public async searchTournaments(attrs: {
        name: string,
        admin_snowflake: string,
        signup_snowflake: string,
        result_snowflake: string,
        page: number,
        limit: number
    }) {
        const offset = (attrs.page - 1) * attrs.limit;
        const whereClause: any = {};
        if (!!attrs.name) {
            const slugName = toSlug(attrs.name, 1);
            whereClause.slug = {
                [Op.like]: `%${slugName}%`,

            }
        }
        if (attrs.admin_snowflake) {
            whereClause.admin_snowflake = attrs.admin_snowflake;
        }
        if (attrs.signup_snowflake) {
            whereClause.signup_snowflake = attrs.signup_snowflake;
        }
        if (attrs.result_snowflake) {
            whereClause.result_snowflake = attrs.result_snowflake;
        }
        return await Tournament.findAndCountAll({
            where: whereClause,
            order: [['finish_date', 'DESC']],
            offset: offset || null,
            limit: attrs.limit || null,
        });
    }

    public async updateTournament(
        slug: string,
        fieldsToUpdate: Partial<TournamentAttributes>
    ) {
        const [updated] = await Tournament.update(fieldsToUpdate, {
            where: { slug: slug },
        });
        if (updated) {
            return await Tournament.findByPk(slug);
        }
        return null;
    }

    public async deleteTournament(slug: string) {
        return await Tournament.destroy({
            where: {slug: slug},
        });
    }
}

export function toSlug(name: string, season: number | string): string {
    return name.toLowerCase().replace(/ /g, '-') +
        (+season === 1 ? '' : '-' + season.toString());
}

export default new TournamentService();
