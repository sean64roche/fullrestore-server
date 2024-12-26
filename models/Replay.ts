import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Replay extends Model {
    declare id: string;
    declare pairing_id: string;
    declare url: string;
    declare match_number: number;
}

Replay.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    pairing_id: {
        type: DataTypes.UUID,
        references: {
            model: 'pairing',
            key: 'id'
        },
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        validate: {
            isUrl: true,
            notEmpty: true,
        },
        allowNull: false,
        unique: true
    },
    match_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    }
}, {
    sequelize,
    modelName: 'Replay',
    tableName: 'replay',
    indexes: [
        {
            unique: true,
            fields: ['pairing_id', 'match_number']
        }
    ]
});

export default Replay;