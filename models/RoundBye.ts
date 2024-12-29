import { DataTypes, Model } from "sequelize";
import sequelize from '../config/database';

class RoundBye extends Model {
    declare id: string;
    declare round_id: string;
    declare entrant_player_id: string;
}

RoundBye.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    round_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'round',
            key: 'id'
        }       
    },
    entrant_player_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'entrant_player',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'RoundBye',
    tableName: 'round_bye',
    indexes: [
        {
            unique: true,
            fields: ['round_id', 'entrant_player_id']
        }
    ]
});

export default RoundBye;