// src/services/entrantPlayerService.ts

import { v4 as uuidv4 } from 'uuid';
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
            const entrant = await EntrantPlayer.create({
                id: uuidv4(),
                ...attrs
            });
            return entrant;
        } catch (error: any) {
            throw error;
        }
    }

    public async getActiveEntrantPlayers() {
        const activeEntrants = await EntrantPlayer.findAll({
            where: { active: true },
            order: [['tournament_id', 'ASC']],
        });
        return activeEntrants;
    }

    public async getEntrantPlayerById(id: string) {
        const entrant = await EntrantPlayer.findByPk(id);
        return entrant;
    }

    public async updateEntrantPlayer(id: string, attrs: Partial<EntrantPlayerAttributes>) {
        const [updated] = await EntrantPlayer.update(
            attrs,
            { where: { id } }
        );

        if (updated) {
            const entrant = await EntrantPlayer.findByPk(id);
            return entrant;
        }
        return null;
    }

    public async deleteEntrantPlayer(id: string) {
        const deleted = await EntrantPlayer.destroy({
            where: { id },
        });
        return deleted;
    }
}

export default new EntrantPlayerService();
