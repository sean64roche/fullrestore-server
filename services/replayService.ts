// src/services/replayService.ts

import {v4 as uuidv4} from 'uuid';
import Replay from '../models/Replay';

interface ReplayAttributes {
    pairing_id: string;
    url: string;
    match_number: number;
}

class ReplayService {
    public async createReplay(attrs: ReplayAttributes) {
        try {
            return await Replay.create({
                id: uuidv4(),
                ...attrs
            });
        } catch (error: any) {
            throw error;
        }

    }

    public async getReplayById(id: string) {
        return await Replay.findByPk(id);
    }

    public async deleteReplay(id: string) {
        return await Replay.destroy({
            where: {id},
        });
    }
}

export default new ReplayService();
