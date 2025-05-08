import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class EntrantTeam extends Model {
    declare id: string;
    declare team_id: string;
    declare tournament_id: string;
    declare active: boolean;
    declare wins: number;
    declare losses: number;
    declare max_round: number;
}

EntrantTeam.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    team_id: {
        type: DataTypes.UUID,
        references: {
            model: 'team',
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
    }
}, {
    sequelize,
    modelName: 'EntrantTeam',
    tableName: 'entrant_team',
    indexes: [
        {
            unique: true,
            fields: ['team_id', 'tournament_id']
        }
    ]
});

export default EntrantTeam;