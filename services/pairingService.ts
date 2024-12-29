import {v4 as uuidv4} from 'uuid';
import Pairing from '../models/Pairing';
import Replay from '../models/Replay';

interface PairingAttributes {
    round_id?: string;
    entrant1_id?: string;
    entrant2_id?: string;
    time_scheduled?: Date;
    time_completed?: Date;
    winner_id?: string;
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

    public async getPairingById(pairingId: string) {
        return await Pairing.findByPk(pairingId, {
            include: [
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
            { where: { id } }
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
