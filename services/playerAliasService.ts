import PlayerAlias from "../models/PlayerAlias";

interface PlayerAliasAttributes {
    player_id: string;
    ps_alias: string;
}

class PlayerAliasService {
    public async createPlayerAlias(attrs: PlayerAliasAttributes) {
        const newPlayerAlias = await PlayerAlias.create({
            ...attrs
        });
        return newPlayerAlias;
    }

    public async getPlayerAlias(alias: string) {
        const player = await PlayerAlias.findOne({
            where: {
                ps_alias: alias
            }
        });
        return player;
    }

    public async deletePlayerAlias(ps_alias: string) {
        const deleted = await PlayerAlias.destroy({
            where: { ps_alias }
        });
        return deleted;
    }
}

export default new PlayerAliasService();