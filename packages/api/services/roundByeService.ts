import RoundBye from "../models/RoundBye";
import {v7 as uuidv7} from 'uuid';
import Round from "../models/Round";
import EntrantPlayer from "../models/EntrantPlayer";
import Player from "../models/Player";

export interface RoundByeAttributes {
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
