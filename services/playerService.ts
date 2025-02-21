import {v4 as uuidv4} from 'uuid';
import Player from '../models/Player';
import EntrantPlayer from '../models/EntrantPlayer';
import { Op } from "sequelize";
import PlayerAlias from "../models/PlayerAlias";

interface PlayerAttributes {
    ps_user: string;
    discord_user?: string;
}

interface GetPlayersParams {
    player?: string;
    ps_user?: string;
    discord_user?: string;
}

class PlayerService {
    public async createPlayer(attrs: PlayerAttributes) {
        return await Player.create({
            id: uuidv4(),
            ...attrs,
            PlayerAlias: {
                ps_alias: attrs.ps_user.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
            },
        }, {
            include: {
                model: PlayerAlias,
                as: 'Aliases'
            },
        });
    }

    public async getPlayer(params: GetPlayersParams) {
        const { player, ps_user, discord_user } = params;
        const whereClause: any = {};
        if (player) {
            whereClause[Op.or] = [{ ps_user: player }, { discord_user: player }];
        } else if (ps_user) {
            whereClause.ps_user = ps_user;
        } else if (discord_user) {
            whereClause.discord_user = discord_user;
        }
        return await Player.findOne({
            where: {
                ...whereClause,
            },
            include: {
                model: PlayerAlias,
                as: 'Aliases'
            },
        });
    }

    public async getPlayerById(id: string) {
        return await Player.findByPk(id);
    }

    public async getPlayerCompetitions(id: string) {
        return await EntrantPlayer.findAll({
            where: {
                player_id: id,
            },
        });
    }

    public async updatePlayer(id: string, attrs: PlayerAttributes) {
        const [updated] = await Player.update(
            { ps_user: attrs.ps_user, discord_user: attrs.discord_user },
            { where: { id } }
        );

        if (updated) {
            return await Player.findByPk(id, {
                include: {
                    model: PlayerAlias,
                    as: 'Aliases'
                },
            });
        }
        return null;
    }

    public async deletePlayer(id: string) {
        return await Player.destroy({
            where: {id},
        });
    }
}

export default new PlayerService();
