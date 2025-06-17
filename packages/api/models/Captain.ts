import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import {v7 as uuidv7} from "uuid";

class Captain extends Model {
    declare id: string;
    declare player_id: string;
    declare entrant_team_id: string;
}

Captain.init({
    id: {
        type: DataTypes.UUID,
        defaultValue() {
            return uuidv7();
        },
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
    entrant_team_id: {
        type: DataTypes.UUID,
        references: {
            model: 'team',
            key: 'id'
        },
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Captain',
    tableName: 'captain',
    indexes: [
        {
            unique: true,
            fields: ['player_id', 'entrant_team_id']
        }
    ]
})