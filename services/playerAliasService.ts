import PlayerAlias from "../models/PlayerAlias";

interface PlayerAliasAttributes {
    player_id: string;
    ps_alias: string;
}

class PlayerAliasService {
    public async createPlayerAlias(attrs: PlayerAliasAttributes) {
        return await PlayerAlias.create({
            ...attrs
        });
    }

    public async getPlayerAlias(alias: string) {
        return await PlayerAlias.findOne({
            where: {
                ps_alias: alias
            }
        });
    }

    public async deletePlayerAlias(ps_alias: string) {
        return await PlayerAlias.destroy({
            where: {ps_alias}
        });
    }
}

export default new PlayerAliasService();