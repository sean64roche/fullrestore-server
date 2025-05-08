import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class EntrantPlayer extends Model {
    declare id: string;
    declare player_id: string;
    declare tournament_id: string;
    declare entrant_team_id? :string;
    declare active: boolean;
    declare wins: number;
    declare losses: number;
    declare max_round: number;
    declare seed?: number;
}

EntrantPlayer.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    player_id: {
        type: DataTypes.UUID,
        references: {
            model: 'player',
            key: 'id'
        },
        allowNull: false
    },
    tournament_id: {
        type: DataTypes.UUID,
        references: {
            model: 'tournament',
            key: 'id'
        },
        allowNull: false
    },
    entrant_team_id: {
        type: DataTypes.UUID,
        references: {
            model: 'team',
            key: 'id'
        },
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    wins: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    losses: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    max_round: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    seed: {
        type: DataTypes.INTEGER,
        unique: true
    }
}, {
    sequelize,
    modelName: 'EntrantPlayer',
    tableName: 'entrant_player',
    indexes: [
        {
            unique: true,
            fields: ['tournament_id', 'player_id']
        },
    ]
});

export default EntrantPlayer;