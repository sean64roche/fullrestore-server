import RoundBye from "../models/RoundBye";
import { v4 as uuidv4 } from 'uuid';

export interface RoundByeAttributes {
    round_id: string;
    entrant_player_id: string;
}

class RoundByeService {
    public async createRoundBye(attrs: RoundByeAttributes) {
        try {
            const newRoundBye = RoundBye.create({
                id: uuidv4(),
                ...attrs
            });
            return newRoundBye;
        } catch (error: any) {
            throw error;
        }
    }

    public async getRoundByeById(id: string) {
        return RoundBye.findByPk(id);
    }

    public async deleteRoundBye(id: string) {
        const deleted = await RoundBye.destroy({ where: { id } });
        return deleted;
    }
}

export default new RoundByeService();