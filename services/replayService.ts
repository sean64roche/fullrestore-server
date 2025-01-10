// src/services/replayService.ts

import Replay from '../models/Replay';

interface ReplayAttributes {
    pairing_id: string;
    url: string;
    match_number: number;
}

interface GetReplayParams {
    url: string;
    pairing_id: string;
}

class ReplayService {
    public async createReplay(attrs: ReplayAttributes) {
        try {
            if (attrs.url.endsWith('?p2')) {
                attrs.url = attrs.url.substring(0, attrs.url.length - 3);
            }
            return await Replay.create({
                ...attrs
            });
        } catch (error: any) {
            throw error;
        }

    }

    async getReplays(params: GetReplayParams) {
        const { url, pairing_id } = params;
        const whereClause: any = {};
        if (url) whereClause.url = url;
        if (pairing_id) whereClause.pairing_id = pairing_id;
        return await Replay.findAll({
            where: {
                ...whereClause,
            }
        });
    }

    public async deleteReplay(id: string) {
        return await Replay.destroy({
            where: {id},
        });
    }
}

export default new ReplayService();
