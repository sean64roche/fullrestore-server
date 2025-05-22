import PlayerAlias from "../models/PlayerAlias";

interface PlayerAliasAttributes {
    player_id: string;
    alias: string;
    primary: boolean;
}

class PlayerAliasService {
    public async createPlayerAlias(attrs: PlayerAliasAttributes) {
        return await PlayerAlias.create({
            ...attrs,
            alias: attrs.alias,
        });
    }

    public async updatePlayerAlias(attrs: PlayerAliasAttributes) {
        const [updated] = await PlayerAlias.update(
            { player_id: attrs.player_id, alias: attrs.alias, primary: attrs.primary },
            { where: { alias: attrs.alias } }
        );

        if (updated) {
            return await PlayerAlias.findOne({ where: { alias: attrs.alias }});
        } else {
            return null;
        }
    }

    public async deletePlayerAlias(alias: string) {
        return await PlayerAlias.destroy({
            where: { alias: alias },
        });
    }


}

export default new PlayerAliasService();