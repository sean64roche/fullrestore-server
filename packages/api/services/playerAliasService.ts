import PlayerAlias from "../models/PlayerAlias";

interface PlayerAliasAttributes {
    player_id: string;
    ps_alias: string;
    primary: boolean;
}

class PlayerAliasService {
    public async createPlayerAlias(attrs: PlayerAliasAttributes) {
        return await PlayerAlias.create({
            ...attrs,
            ps_alias: attrs.ps_alias,
        });
    }

    public async updatePlayerAlias(attrs: PlayerAliasAttributes) {
        const [updated] = await PlayerAlias.update(
            { player_id: attrs.player_id, ps_alias: attrs.ps_alias, primary: attrs.primary },
            { where: { ps_alias: attrs.ps_alias } }
        );

        if (updated) {
            return await PlayerAlias.findOne({ where: { ps_alias: attrs.ps_alias }});
        } else {
            return null;
        }
    }

    public async deletePlayerAlias(ps_alias: string) {
        return await PlayerAlias.destroy({
            where: { ps_alias: ps_alias },
        });
    }


}

export default new PlayerAliasService();