// src/services/replayService.ts

import Replay from '../models/Replay';

interface ReplayAttributes {
    pairing_id: string;
    url: string;
    match_number: number;
}

interface GetReplayParams {
    url?: string;
    pairing_id?: string;
    match_number?: number;
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
        const { url, pairing_id, match_number } = params;
        const whereClause: any = {};
        if (url) {
            if (url.endsWith('?p2')) {
                whereClause.url = url.substring(0, url.length - 3);
            } else {
                whereClause.url = url;
            }
        }
        if (pairing_id) whereClause.pairing_id = pairing_id;
        if (match_number) whereClause.match_number = match_number;
        return await Replay.findAll({
            where: {
                ...whereClause,
            }
        });
    }

    public async deleteReplay(url: string) {
        return await Replay.destroy({
            where: { url },
        });
    }
}

export default new ReplayService();
