import EntrantPlayer from "../models/EntrantPlayer";
import PlayerAlias from "../models/PlayerAlias";
import Player from "../models/Player";
import Pairing from "../models/Pairing";
import RoundBye from "../models/RoundBye";
import Round from "../models/Round";
import Tournament from "../models/Tournament";
import Replay from "../models/Replay";
import Format from "../models/Format";

export function initAssociations() {

    Player.hasMany(EntrantPlayer, { foreignKey: 'player_id' });
    Player.hasMany(PlayerAlias, { as: 'Aliases', foreignKey: 'player_id' });
    EntrantPlayer.belongsTo(Player, { foreignKey: 'player_id' });
    PlayerAlias.belongsTo(Player, { foreignKey: 'player_id' });

    EntrantPlayer.hasMany(Pairing, { as: 'Entrant1', foreignKey: 'entrant1_id' });
    EntrantPlayer.hasMany(Pairing, { as: 'Entrant2', foreignKey: 'entrant2_id' });
    EntrantPlayer.hasMany(Pairing, { as: 'Winner', foreignKey: 'winner_id' });
    EntrantPlayer.hasMany(RoundBye, { foreignKey: 'entrant_player_id' });
    Pairing.belongsTo(EntrantPlayer, { as: 'Entrant1', foreignKey: 'entrant1_id' });
    Pairing.belongsTo(EntrantPlayer, { as: 'Entrant2', foreignKey: 'entrant2_id' });
    Pairing.belongsTo(EntrantPlayer, { as: 'Winner', foreignKey: 'winner_id' });
    RoundBye.belongsTo(EntrantPlayer, { foreignKey: 'entrant_player_id' });

    Tournament.hasMany(EntrantPlayer, { foreignKey: 'tournament_id', onDelete: 'CASCADE' });
    Tournament.hasMany(Round, { foreignKey: 'tournament_id', onDelete: 'CASCADE' });
    EntrantPlayer.belongsTo(Tournament, { foreignKey: 'tournament_id' });
    Round.belongsTo(Tournament, { foreignKey: 'tournament_id' });

    Format.hasMany(Tournament, { foreignKey: 'format' });

    Round.hasMany(Pairing, { foreignKey: 'round_id', onDelete: 'CASCADE' });
    Round.hasMany(RoundBye, { foreignKey: 'round_id', onDelete: 'CASCADE' });
    Pairing.belongsTo(Round, { foreignKey: 'round_id' });
    RoundBye.belongsTo(Round, { foreignKey: 'round_id' });

    Pairing.hasMany(Replay, { foreignKey: 'pairing_id' });
    Replay.belongsTo(Pairing, { foreignKey: 'pairing_id' });

}
