import {v7 as uuidv7} from 'uuid';
import Pairing from '../models/Pairing';
import Replay from '../models/Replay';
import Round from "../models/Round";
import EntrantPlayer from "../models/EntrantPlayer";
import Player from "../models/Player";
import Tournament from "../models/Tournament";
import {literal, Op} from 'sequelize';
import PlayerAlias from "../models/PlayerAlias";
import Content from "../models/Content";
import sequelize from "../config/database";

interface PairingAttributes {
    round_id?: string;
    entrant1_id?: string;
    entrant2_id?: string;
    time_scheduled?: Date;
    time_completed?: Date;
    winner_id?: string;
}

interface GetPairingParams {
    round_id?: string;
    tournament_slug?: string;
    round?: number;
    player?: string;
    discord_user?: string;
    discord_id?: string;
    winner?: string;
}

type GetPlayerPairingsParams = {
    player: string;
    page: number;
    limit?: number;
}

class PairingService {
        public async createPairing(attrs: PairingAttributes) {
            try {
                const result = await Pairing.create({
                    id: uuidv7(),
                    ...attrs
                });
                await refreshRoundEntrantWins();
                return result;
        } catch (error: any) {
            throw error;
        }
    }

    public async getPairings(params: GetPairingParams) {
        const { round_id, tournament_slug, round, player, discord_user, discord_id, winner } = params;
        const whereClause: any = {};
            if (round_id) {
                whereClause.round_id = round_id;
            }
            if (round) {
                whereClause['$Round.round$'] = round;
            }
            if (tournament_slug) {
                whereClause['$Round.Tournament.slug$'] = tournament_slug;
            }
            if (player) {
                whereClause[Op.or] = [
                    {
                        [Op.or]: [{
                            '$Entrant1.Player.ps_user$': player
                        },{
                            '$Entrant2.Player.ps_user$': player
                        },{
                            '$Entrant1.Player.Aliases.alias$': player
                        },{
                            '$Entrant2.Player.Aliases.alias$': player
                        }]
                    }
                ]
            }
            if (discord_user) {
                whereClause[Op.or] = [
                    { '$Entrant1.Player.discord_user$': discord_user },
                    { '$Entrant2.Player.discord_user$': discord_user }
                ];
            }
        if (discord_id) {
            whereClause[Op.or] = [
                { '$Entrant1.Player.discord_id$': discord_id },
                { '$Entrant2.Player.discord_id$': discord_id }
            ];
        }
            if (winner) {
                whereClause[Op.or] = [
                    { '$Winner.Player.ps_user$': winner },
                    { '$Winner.Player.Aliases.alias$': winner }
                ];
            }
            return await Pairing.findAll({
                include: [
                    {
                        model: Round,
                        include: [{
                            model: Tournament,
                        }]
                    },
                    {
                        model: EntrantPlayer,
                        as: 'Entrant1',
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
                    },
                    {
                        model: EntrantPlayer,
                        as: 'Entrant2',
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
                    },
                    {
                        model: EntrantPlayer,
                        as: 'Winner',
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
                    },
                    {
                        model: Replay,
                        attributes: ['match_number', 'url', 'json'],
                        order: [['match_number', 'ASC']],
                    },
                    {
                        model: Content,
                        as: 'Content',
                        attributes: ['url'],
                    }
                ],
                where: {
                    ...whereClause
                }
            });
    }

    public async getPairingById(pairingId: string) {
        return await Pairing.findByPk(pairingId, {
            include: [
                {
                    model: Round,
                    include: [{
                        model: Tournament,
                    }]
                },
                {
                    model: EntrantPlayer,
                    as: 'Entrant1',
                    include: [{
                        model: Player,
                        include: [{
                            model: PlayerAlias,
                            as: 'Aliases',
                            required: false
                        }]
                    }]
                },
                {
                    model: EntrantPlayer,
                    as: 'Entrant2',
                    include: [{
                        model: Player,
                        include: [{
                            model: PlayerAlias,
                            as: 'Aliases',
                            required: false
                        }]
                    }]
                },
                {
                    model: EntrantPlayer,
                    as: 'Winner',
                    include: [{
                        model: Player,
                        include: [{
                            model: PlayerAlias,
                            as: 'Aliases',
                            required: false
                        }]
                    }]
                },
                {
                    model: Replay,
                    attributes: ['match_number', 'url'],
                    order: [['match_number', 'ASC']],
                },
                {
                    model: Content,
                    as: 'Content',
                    attributes: ['url'],
                }
            ],
        });
    }

    public async getRecentMatches(params: GetPlayerPairingsParams) {
        const { player, page, limit } = params;
        const offset = (page - 1) * limit;
        let whereClause: any = {};
        if (!!player) {
            whereClause = {
                [Op.or]: [{
                    '$Entrant1.Player.ps_user$': player
                },{
                    '$Entrant2.Player.ps_user$': player
                }]
            };
        }

        return await Pairing.findAndCountAll({
            where: {
                ...whereClause,
                winner_id: { [Op.not]: null },
                [Op.and]: literal(`EXISTS (
                    SELECT 1
                    FROM "replay" AS "Replays"
                    WHERE "Replays"."pairing_id" = "Pairing"."id"
                    )`
                )
            },
            order: [
                ['time_completed', 'DESC'],
                [Pairing.associations.Round, 'deadline', 'DESC'],
                [Pairing.associations.Round, Round.associations.Tournament, 'finish_date', 'DESC'],
                [Pairing.associations.Round, 'round', 'DESC'],
                ['updatedAt', 'DESC'],
            ],
            subQuery: false,
            limit: limit || null,
            offset: offset || null,
            include: [
                {
                    model: Round,
                    include: [{
                        model: Tournament,
                    }]
                },
                {
                    model: EntrantPlayer,
                    as: 'Entrant1',
                    include: [{
                        model: Player,
                        include: [{
                            model: PlayerAlias,
                            as: 'Aliases',
                            required: false,
                            where: { primary: true }
                        }]
                    }]
                },
                {
                    model: EntrantPlayer,
                    as: 'Entrant2',
                    include: [{
                        model: Player,
                        include: [{
                            model: PlayerAlias,
                            as: 'Aliases',
                            required: false,
                            where: { primary: true }
                        }]
                    }],
                },
                {
                    model: EntrantPlayer,
                    as: 'Winner',
                    include: [{
                        model: Player,
                        include: [{
                            model: PlayerAlias,
                            as: 'Aliases',
                            required: false,
                            where: { primary: true }
                        }]
                    }],
                }
            ],
        });
    }

    public async updatePairing(id: string, attrs: Partial<PairingAttributes>) {
        const [updated] = await Pairing.update(
            attrs,
            { where: { id: id } },
        );

        if (updated) {
            const result = await Pairing.findByPk(id);
            await refreshRoundEntrantWins();
            return result;
        }
        return null;
    }

    public async deletePairing(id: string) {
        const result = await Pairing.destroy({
            where: {id}
        });
        if (result) {
            await refreshRoundEntrantWins();
            return result;
        }
    }
}

async function refreshRoundEntrantWins() {
    await sequelize.query(`REFRESH MATERIALIZED VIEW round_entrant_wins;`);
}

export default new PairingService();
