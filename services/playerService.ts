import { v4 as uuidv4 } from 'uuid';
import Player from '../models/Player';
import EntrantPlayer from '../models/EntrantPlayer';

interface PlayerAttributes {
    ps_user: string;
    discord_user?: string;
}

class PlayerService {
    public async createPlayer(attrs: PlayerAttributes) {
        const newPlayer = await Player.create({
            id: uuidv4(),
            ...attrs
        });
        return newPlayer;
    }

    public async getAllPlayers() {
        const players = await Player.findAll();
        return players;
    }

    public async getPlayerById(id: string) {
        const player = await Player.findByPk(id);
        return player;
    }

    public async getPlayerCompetitions(id: string) {
        const competitions = await EntrantPlayer.findAll({
            where: {
                player_id: id,
            },
        });
        return competitions;
    }

    public async updatePlayer(id: string, attrs: PlayerAttributes) {
        const [updated] = await Player.update(
            { ps_user: attrs.ps_user, discord_user: attrs.discord_user },
            { where: { id } }
        );

        if (updated) {
            const updatedPlayer = await Player.findByPk(id);
            return updatedPlayer;
        }
        return null;
    }

    public async deletePlayer(id: string) {
        const deleted = await Player.destroy({
            where: { id },
        });
        return deleted;
    }
}

export default new PlayerService();
