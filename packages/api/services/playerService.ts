import {v7 as uuidv7} from 'uuid';
import Player from '../models/Player';
import EntrantPlayer from '../models/EntrantPlayer';
import PlayerAlias from "../models/PlayerAlias";
import {literal, Op} from "sequelize";

interface PlayerAttributes {
    ps_user: string;
    discord_user?: string;
    discord_id?: string;
}

interface GetPlayersParams {
    player?: string;
    ps_user?: string;
    discord_user?: string;
    discord_id?: string;
}

class PlayerService {
    public async createPlayer(attrs: PlayerAttributes) {
        const newAttrs: PlayerAttributes = {
            ...attrs,
            ps_user: toPSAlias(attrs.ps_user),
            discord_user: attrs.discord_user && toDiscordAlias(attrs.discord_user),
        }
        return await Player.create({
            id: uuidv7(),
            ...newAttrs,
            PlayerAlias: {
                alias: attrs.ps_user,
                primary: true,
            },
        }, {
            include: {
                model: PlayerAlias,
                as: 'Aliases'
            },
        });
    }

    public async getPlayer(params: GetPlayersParams) {
        const { player, ps_user, discord_user, discord_id } = params;
        const queryOptions: any = {
            include: {
                model: PlayerAlias,
                as: 'Aliases',
                required: false
            }
        };
        if (player) {
            const playerWithAlias = await Player.findOne({
                include: {
                    model: PlayerAlias,
                    as: 'Aliases',
                    where: { alias: toPSAlias(player) },
                    required: true
                }
            });

            if (!playerWithAlias) return null;

            return await Player.findByPk(playerWithAlias.id, {
                include: {
                    model: PlayerAlias,
                    as: 'Aliases',
                    required: false
                }
            });
        }
        const whereClause: any = {};
        if (ps_user) {
            whereClause.ps_user = toPSAlias(ps_user);
        } else if (discord_user) {
            whereClause.discord_user = toDiscordAlias(discord_user);
        } else if (discord_id) {
            whereClause.discord_id = discord_id;
        }
        queryOptions.where = whereClause;
        return await Player.findOne(queryOptions);
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

    public async searchPlayers(player: string) {
        if (player.length < 3) return await Player.findAll({
            include: {
                model: PlayerAlias,
                as: 'Aliases',
                required: false,
            },
            where: {
                id: {
                    [Op.in]: literal(`(
                        SELECT "player_id"
                        FROM "player_alias"
                        WHERE LOWER("alias") = '${toPSAlias(player)}'
                    )`)
                }
            },
        });
        else return await Player.findAll({
            include: {
                model: PlayerAlias,
                as: 'Aliases',
                required: false,
            },
            where: {
                id: {
                    [Op.in]: literal(`(
                        SELECT "player_id"
                        FROM "player_alias"
                        WHERE LOWER("alias") LIKE '%${toPSAlias(player)}%'
                    )`)
                }
            },
            order: [[Player.associations.Aliases, 'primary', 'DESC']]
        });
    }

    public async updatePlayer(id: string, attrs: PlayerAttributes) {
        const [updated] = await Player.update({
                ps_user: toPSAlias(attrs.ps_user),
                discord_user: attrs.discord_user && toDiscordAlias(attrs.discord_user),
                discord_id: attrs.discord_id,
            },
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

function toDiscordAlias(alias: string) {
    return alias.toLowerCase().replace(/[^a-z0-9_.]/g, '')
}

function toPSAlias(alias: string) {
    return alias.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export default new PlayerService();
