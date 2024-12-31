import Round from '../models/Round';
import Pairing from '../models/Pairing';
import {v4 as uuidv4} from 'uuid';
import RoundBye from '../models/RoundBye';
import Tournament from "../models/Tournament";

export interface RoundAttributes {
    tournament_id: string;
    round: string;
    name?: string;
    deadline: string;
}
class RoundService {
    public async createRound(attrs: RoundAttributes) {
        try {
            return Round.create({
                id: uuidv4(),
                ...attrs
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async getRoundById(id: string) {
        return Round.findByPk(id, {
            include: Tournament
        });
    }

    public async getPairingsByRoundId(roundId: string) {
        return Pairing.findAll({
            where: { round_id: roundId },
            order: [['time_completed', 'DESC']],
        });
    }

    public async getByesByRoundId(roundId: string) {
        return RoundBye.findAll({
            where: { round_id: roundId },
        });
    }

    public async updateRound(id: string, attrs: Partial<RoundAttributes>) {
        const [updated] = await Round.update(
            attrs,
            { where: { id } }
        );
        if (updated) {
            return await Round.findByPk(id);
        }
        return null;
    }

    public async deleteRound(id: string) {
        return await Round.destroy({where: {id}});
    }
}

export default new RoundService();
