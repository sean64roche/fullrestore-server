// src/services/entrantPlayerService.ts

import {v7 as uuidv7} from 'uuid';
import EntrantPlayer from '../models/EntrantPlayer';
import Player from "../models/Player";
import Tournament from "../models/Tournament";
import PlayerAlias from "../models/PlayerAlias";
import RoundEntrantWins from "../models/RoundEntrantWins";
import {DataTypes, Op} from "sequelize";
import sequelize from "../config/database";

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

interface GetRoundEntrantWinsParams {
    round?: number;
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
        const { wins, losses } = countWinsLosses(roundEntrantResults);
        const entrantPlayerWins = sequelize.define('entrant_player_wins', {
            entrant_player_id: {
                type: DataTypes.UUID,
                defaultValue: entrant_player_id,
            },
            max_round: {
                type: DataTypes.INTEGER,
                defaultValue: +round,
            },
            wins: {
                type: DataTypes.INTEGER,
                defaultValue: wins
            },
            losses: {
                type: DataTypes.INTEGER,
                defaultValue: losses
            }
        }, {
            timestamps: false,
        });
        entrantPlayerWins.removeAttribute('id');
        return entrantPlayerWins.build();
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

function countWinsLosses(results: RoundEntrantWins[]) {
    const wins = results.filter(result => result.win === true);
    const losses = results.filter(result => result.win === false);
    return {
        wins: wins.length,
        losses: losses.length,
    }
}

export default new EntrantPlayerService();
