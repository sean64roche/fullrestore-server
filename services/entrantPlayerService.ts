// src/services/entrantPlayerService.ts

import {v4 as uuidv4} from 'uuid';
import EntrantPlayer from '../models/EntrantPlayer';

interface EntrantPlayerAttributes {
    player_id: string;
    tournament_id: string;
    entrant_team_id?: string;
    active?: boolean;
    wins?: number;
    losses?: number;
    max_round?: number;
    seed?: number;
}

class EntrantPlayerService {
    public async createEntrantPlayer(attrs: EntrantPlayerAttributes) {
        try {
            return await EntrantPlayer.create({
                id: uuidv4(),
                ...attrs
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async getActiveEntrantPlayers() {
        return await EntrantPlayer.findAll({
            where: {active: true},
            order: [['tournament_id', 'ASC']],
        });
    }

    public async getEntrantPlayerById(id: string) {
        return await EntrantPlayer.findByPk(id);
    }

    public async updateEntrantPlayer(id: string, attrs: Partial<EntrantPlayerAttributes>) {
        const [updated] = await EntrantPlayer.update(
            attrs,
            { where: { id } }
        );

        if (updated) {
            return await EntrantPlayer.findByPk(id);
        }
        return null;
    }

    public async deleteEntrantPlayer(id: string) {
        return await EntrantPlayer.destroy({
            where: {id},
        });
    }
}

export default new EntrantPlayerService();
