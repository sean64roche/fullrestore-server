import PlayerAlias from "../models/PlayerAlias";
import Player from "../models/Player";
import {toPSAlias} from "./playerService";

interface PlayerAliasAttributes {
    player_id: string;
    ps_alias: string;
}

class PlayerAliasService {
    public async createPlayerAlias(attrs: PlayerAliasAttributes) {
        return await PlayerAlias.create({
            ...attrs,
            ps_alias: toPSAlias(attrs.ps_alias),
        });
    }

    public async getPlayerAlias(alias: string) {
        return await PlayerAlias.findOne({
            where: {
                ps_alias: toPSAlias(alias),
            },
            include: Player
        });
    }

    public async deletePlayerAlias(ps_alias: string) {
        return await PlayerAlias.destroy({
            where: { ps_alias: toPSAlias(ps_alias) },
        });
    }
}

export default new PlayerAliasService();