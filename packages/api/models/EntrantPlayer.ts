import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class EntrantPlayer extends Model {
    declare id: string;
    declare player_id: string;
    declare tournament_slug: string;
    declare entrant_team_id? :string;
    declare active: boolean;
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
    tournament_slug: {
        type: DataTypes.TEXT,
        references: {
            model: 'tournament',
            key: 'slug'
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
            fields: ['tournament_slug', 'player_id']
        },
    ]
});

export default EntrantPlayer;