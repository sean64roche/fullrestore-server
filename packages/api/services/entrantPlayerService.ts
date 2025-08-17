// src/services/entrantPlayerService.ts

import {v7 as uuidv7} from 'uuid';
import EntrantPlayer from '../models/EntrantPlayer';
import Player from "../models/Player";
import Tournament from "../models/Tournament";
import PlayerAlias from "../models/PlayerAlias";
import RoundEntrantWins from "../models/RoundEntrantWins";
import {Op} from "sequelize";

interface EntrantPlayerAttributes {
    player_id: string;
    tournament_slug: string;
    entrant_team_id?: string;
    active?: boolean;
    wins?: number;
    losses?: number;
    byes?: number;
    max_round?: number;
    seed?: number;
}

interface GetEntrantPlayerParams {
    player_id?: string;
    tournament_slug?: string;
    active?: boolean;
}

interface GetRoundEntrantWinsParams {
    round?: number;
}

interface DeleteEntrantPlayerParams {
    id?: string;
    player_id?: string;
    tournament_slug?: string;
}

class EntrantPlayerService {
    public async createEntrantPlayer(attrs: EntrantPlayerAttributes) {
        try {
            return await EntrantPlayer.create({
                id: uuidv7(),
                ...attrs
            });
        } catch (error: any) {
            throw error;
        }
    }

    async getEntrantPlayer(params: GetEntrantPlayerParams) {
        const { player_id, tournament_slug, active } = params;
        const whereClause: any = {};
        if (player_id) {
            whereClause.player_id = player_id;
        }
        if (tournament_slug) {
            whereClause.tournament_slug = tournament_slug;
        }
        if (active) {
            whereClause.active = active;
        }
        return await EntrantPlayer.findAll({
            include: [{
                model: Player,
                include: [{
                    model: PlayerAlias,
                    as: 'Aliases',
                    required: false
                }]
            }, {
                model: Tournament
            }],
            where: {
                ...whereClause
            }
        })
    }

    public async getEntrantPlayerById(id: string) {
        return await EntrantPlayer.findByPk(id, {
            include: [{
                model: Player
            }, {
                model: Tournament
            }]
        });
    }

    public async getEntrantPlayerWins(entrant_player_id: string, params: GetRoundEntrantWinsParams) {
        let { round } = params;
        const whereClause: any = {};
        if (round) {
            whereClause.round = {
                [Op.lte]: round
            };
        }
        const roundEntrantResults = await RoundEntrantWins.findAll({
            where: {
                entrant_player_id: entrant_player_id,
                ...whereClause
            }
        });
        let player: EntrantPlayer;
        if (roundEntrantResults.length === 0) {
            player = await this.getEntrantPlayerById(entrant_player_id);
        }

        const { wins, losses } = countWinsLosses(roundEntrantResults);
        const { byes } = countByes(roundEntrantResults);
        return {
           entrant_player_id: entrant_player_id,
           //@ts-ignore
           ps_user: roundEntrantResults[0]?.ps_user ?? player.Player.ps_user,
           max_round: +round,
           wins: wins,
           losses: losses,
           byes: byes,
        };
    }

    public async updateEntrantPlayer(id: string, attrs: Partial<EntrantPlayerAttributes>) {
        const [updated] = await EntrantPlayer.update(
            attrs,
            { where: { id } }
        );

        if (updated) {
            return await EntrantPlayer.findByPk(id);
        }
        return null;
    }

    public async deleteEntrantPlayer(attrs: DeleteEntrantPlayerParams) {
        const whereClause: any = {};
        if (!!attrs.id) {
            whereClause.id = attrs.id;
        } else if (!!attrs.player_id && !!attrs.tournament_slug) {
            whereClause.player_id = attrs.player_id;
            whereClause.tournament_slug = attrs.tournament_slug;
        }
        return await EntrantPlayer.destroy({
            where: {
                ...whereClause
            }
        });
    }
}

function countWinsLosses(results: RoundEntrantWins[]) {
    const wins = results.filter(result => result.win === true);
    const losses = results.filter(result => result.win === false);
    return {
        wins: wins.length ?? 0,
        losses: losses.length ?? 0,
    }
}

function countByes(results: RoundEntrantWins[]) {
    return { byes: (results.filter(result => result.bye === true)).length ?? 0 };
}

export default new EntrantPlayerService();
