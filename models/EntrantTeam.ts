import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class EntrantTeam extends Model {
    public id!: string;
    public team_id!: string;
    public tournament_id!: string;
    public active: boolean;
    public wins: number;
    public losses: number;
    public max_round: number;
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