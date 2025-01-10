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

interface GetRoundParams {
    tournament_id: string;
    round: number;
    name?: string;
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

    async getRounds(params: GetRoundParams) {
        const { tournament_id, round, name } = params;
        const whereClause: any = {};
        if (tournament_id) whereClause.tournament_id = tournament_id;
        if (round) whereClause.round = round;
        if (name) whereClause.name = name;
        return await Round.findAll({
            where: {
                ...whereClause
            }
        });
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
