import RoundBye from "../models/RoundBye";
import {v4 as uuidv4} from 'uuid';

export interface RoundByeAttributes {
    round_id: string;
    entrant_player_id: string;
}

class RoundByeService {
    public async createRoundBye(attrs: RoundByeAttributes) {
        try {
            return RoundBye.create({
                id: uuidv4(),
                ...attrs
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async getRoundByeById(id: string) {
        return RoundBye.findByPk(id);
    }

    public async deleteRoundBye(id: string) {
        return await RoundBye.destroy({where: {id}});
    }
}

export default new RoundByeService();