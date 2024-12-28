// src/services/replayService.ts

import { v4 as uuidv4 } from 'uuid';
import Replay from '../models/Replay';

interface ReplayAttributes {
    pairing_id: string;
    url: string;
    match_number: number;
}

class ReplayService {
    public async createReplay(attrs: ReplayAttributes) {
        try {
            const newReplay = await Replay.create({
                id: uuidv4(),
                ...attrs
            });
            return newReplay;
        } catch (error: any) {
            throw error;
        }

    }

    public async getReplayById(id: string) {
        const replay = await Replay.findByPk(id);
        return replay;
    }

    public async deleteReplay(id: string) {
        const deleted = await Replay.destroy({
            where: { id },
        });
        return deleted;
    }
}

export default new ReplayService();
