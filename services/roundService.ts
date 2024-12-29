import Round from '../models/Round';
import Pairing from '../models/Pairing';
import { v4 as uuidv4 } from 'uuid';
import RoundBye from '../models/RoundBye';

export interface RoundAttributes {
    tournament_id: string;
    round: string;
    name?: string;
    deadline: string;
}
class RoundService {
    public async createRound(attrs: RoundAttributes) {
        try {
            const newRound = Round.create({
                id: uuidv4(),
                ...attrs
            });
            return newRound;
        } catch (error: any) {
            throw error;
        }
    }

    public async getRoundById(id: string) {
        return Round.findByPk(id);
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
            const round = await Round.findByPk(id);
            return round;
        }
        return null;
    }

    public async deleteRound(id: string) {
        const deleted = await Round.destroy({ where: { id } });
        return deleted;
    }
}

export default new RoundService();
