// src/services/entrantPlayerService.ts

import {v4 as uuidv4} from 'uuid';
import EntrantPlayer from '../models/EntrantPlayer';
import Player from "../models/Player";
import Tournament from "../models/Tournament";
import PlayerAlias from "../models/PlayerAlias";

interface EntrantPlayerAttributes {
    player_id: string;
    tournament_slug: string;
    entrant_team_id?: string;
    active?: boolean;
    wins?: number;
    losses?: number;
    max_round?: number;
    seed?: number;
}

interface GetEntrantPlayerParams {
    player_id?: string;
    tournament_slug?: string;
    active?: boolean;
}

class EntrantPlayerService {
    public async createEntrantPlayer(attrs: EntrantPlayerAttributes) {
        try {
            return await EntrantPlayer.create({
                id: uuidv4(),
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

    public async deleteEntrantPlayer(id: string) {
        return await EntrantPlayer.destroy({
            where: {id},
        });
    }
}

export default new EntrantPlayerService();
