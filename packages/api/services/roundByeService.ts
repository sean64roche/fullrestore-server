import RoundBye from "../models/RoundBye";
import {v7 as uuidv7} from 'uuid';
import Round from "../models/Round";
import EntrantPlayer from "../models/EntrantPlayer";
import Player from "../models/Player";
import Tournament from "../models/Tournament";
import PlayerAlias from "../models/PlayerAlias";

export interface RoundByeAttributes {
    round_id: string;
    entrant_player_id: string;
}

export interface GetRoundByeParams {
    tournament_slug: string;
    round: number;
    round_id: string;
    entrant_player_id: string;
}

class RoundByeService {
    public async createRoundBye(attrs: RoundByeAttributes) {
        try {
            return RoundBye.create({
                id: uuidv7(),
                ...attrs
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async getRoundByes(params: GetRoundByeParams) {
        const {tournament_slug, round, round_id, entrant_player_id} = params;
        const whereClause: any = {};
        if (tournament_slug) {
            whereClause['$Round.Tournament.slug$'] = tournament_slug;
        }
        if (round) {
            whereClause['$Round.round$'] = round;
        }
        if (round_id) whereClause.round_id = round_id;
        if (entrant_player_id) whereClause.entrant_player_id = entrant_player_id;
        return await RoundBye.findAll({
            include: [
                {
                    model: Round,
                    include: [{
                        model: Tournament,
                    }]
                },
                {
                    model: EntrantPlayer,
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
            ],
            where: {
                ...whereClause,
            }
        });
    }

    public async getRoundByeById(id: string) {
        return RoundBye.findByPk(id, {
            include: [{
                model: Round,
            },
            {
                model: EntrantPlayer,
                include: [Player]
            }]
        });
    }

    public async deleteRoundBye(id: string) {
        return await RoundBye.destroy({where: {id}});
    }
}

export default new RoundByeService();
