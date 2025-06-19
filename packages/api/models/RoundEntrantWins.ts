import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class RoundEntrantWins extends Model {
    declare entrant_player_id: string;
    declare ps_user: string;
    declare round_id: string;
    declare round: number;
    declare tournament_slug: string;
    declare tournament_name: string;
    declare win: boolean;
}

RoundEntrantWins.init({
    entrant_player_id: {
        type: DataTypes.UUID,
        references: {
            model: 'entrant_player',
            key: 'id'
        },
        allowNull: false,
        primaryKey: true
    },
    ps_user: {
        type: DataTypes.UUID,
        references: {
            model: 'player',
            key: 'ps_user',
        },
        allowNull: false
    },
    round_id: {
        type: DataTypes.UUID,
        references: {
            model: 'round',
            key: 'id'
        },
        allowNull: false
    },
    round: {
        type: DataTypes.INTEGER,
        references: {
            model: 'round',
            key: 'id'
        },
        allowNull: false
    },
    tournament_slug: {
        type: DataTypes.TEXT,
        references: {
            model: 'tournament',
            key: 'slug'
        },
        allowNull: false
    },
    tournament_name: {
        type: DataTypes.INTEGER,
        references: {
            model: 'tournament',
            key: 'name'
        },
        allowNull: false
    },
    win: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'RoundEntrantWins',
    tableName: 'round_entrant_wins',
    timestamps: false,
});

RoundEntrantWins.removeAttribute('id');

export default RoundEntrantWins;