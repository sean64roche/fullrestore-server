import {v4 as uuidv4} from 'uuid';
import Pairing from '../models/Pairing';
import Replay from '../models/Replay';
import Round from "../models/Round";
import EntrantPlayer from "../models/EntrantPlayer";
import Player from "../models/Player";
import Tournament from "../models/Tournament";
import { Op } from 'sequelize';

interface PairingAttributes {
    round_id?: string;
    entrant1_id?: string;
    entrant2_id?: string;
    time_scheduled?: Date;
    time_completed?: Date;
    winner_id?: string;
}

interface GetPairingParams {
    roundId?: string;
    tournament?: string;
    player?: string;
    winner?: string;
}

class PairingService {
        public async createPairing(attrs: PairingAttributes) {
            try {
                return await Pairing.create({
                id: uuidv4(),
                ...attrs
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async getPairings(params: GetPairingParams) {
            const { roundId, tournament, player, winner } = params;
            const whereClause: any = {};
            if (roundId) {
                whereClause.round = roundId;
            }
            if (tournament) {
                whereClause.name = tournament;
            }
            //this isn't important yet. Come back to it later
            if (player) {
                // whereClause[Op.or] = [
                //     {
                //         [Op.or]: [{
                //             '$Entrant1.Player.ps_user$': player
                //         }, {
                //             '$Entrant1.Player.discord_user$': player
                //         }],
                //         [Op.or]: [{
                //             '$Entrant2.Player.ps_user$': player
                //         }, {
                //             '$Entrant2.Player.discord_user$': player
                //         }]
                //     }
                // ]
            }
            if (winner) {
                whereClause[Op.or] = [
                    { '$Winner.Player.ps_user$': winner },
                    { '$Winner.Player.discord_user$': winner }
                ];
            }
            return await Pairing.findAll({
                include: [
                    {
                        model: Round,
                        attributes: ['id', 'round', 'name'],

                        include: [{
                            model: Tournament,
                            attributes: ['id', 'name', 'season'],
                        }]
                    },
                    {
                        model: EntrantPlayer,
                        as: 'Entrant1',
                        attributes: ['id'],
                        include: [{
                            model: Player,
                        }]
                    },
                    {
                        model: EntrantPlayer,
                        as: 'Entrant2',
                        attributes: ['id'],
                        include: [{
                            model: Player,
                        }]
                    },
                    {
                        model: EntrantPlayer,
                        as: 'Winner',
                        attributes: ['id'],
                        include: [{
                            model: Player,
                        }]
                    },
                    {
                        model: Replay,
                        attributes: ['match_number', 'url', 'id'],
                        order: [['match_number', 'ASC']],
                    },
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
                    attributes: ['id', 'round', 'name'],
                    include: [{
                        model: Tournament,
                        attributes: ['id','name', 'season'],
                    }]
                },
                {
                    model: EntrantPlayer,
                    as: 'Entrant1',
                    attributes: ['id'],
                    include: [Player]
                },
                {
                    model: EntrantPlayer,
                    as: 'Entrant2',
                    attributes: ['id'],
                    include: [Player]
                },
                {
                    model: EntrantPlayer,
                    as: 'Winner',
                    attributes: ['id'],
                    include: [Player]
                },
                {
                    model: Replay,
                    attributes: ['match_number', 'url', 'id'],
                    order: [['match_number', 'ASC']],
                },
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
            return await Pairing.findByPk(id);
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
