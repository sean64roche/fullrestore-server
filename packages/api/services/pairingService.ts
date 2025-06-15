import {v4 as uuidv4} from 'uuid';
import Pairing from '../models/Pairing';
import Replay from '../models/Replay';
import Round from "../models/Round";
import EntrantPlayer from "../models/EntrantPlayer";
import Player from "../models/Player";
import Tournament from "../models/Tournament";
import { Op } from 'sequelize';
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
    tournament?: string;
    round?: number;
    player?: string;
    discord_user?: string;
    winner?: string;
}

class PairingService {
        public async createPairing(attrs: PairingAttributes) {
            try {
                const result = await Pairing.create({
                    id: uuidv4(),
                    ...attrs
                });
                await sequelize.query(`REFRESH MATERIALIZED VIEW round_entrant_wins;`);
                return result;
        } catch (error: any) {
            throw error;
        }
    }

    public async getPairings(params: GetPairingParams) {
            const { round_id, tournament, round, player, discord_user, winner } = params;
            const whereClause: any = {};
            if (round_id) {
                whereClause.round_id = round_id;
            }
            if (round) {
                whereClause['$Round.round$'] = round;
            }
            if (tournament) {
                whereClause['$Round.Tournament.name$'] = tournament;
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

    public async updatePairing(id: string, attrs: Partial<PairingAttributes>) {
        const [updated] = await Pairing.update(
            {
                attrs,
            },
            { where: { id } },
        );

        if (updated) {
            const result = await Pairing.findByPk(id);
            await sequelize.query(`REFRESH MATERIALIZED VIEW round_entrant_wins;`);
            return result;
        }
        return null;
    }

    public async deletePairing(id: string) {
        return await Pairing.destroy({
            where: {id}
        });
    }
}

export default new PairingService();
