import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Replay extends Model {
    public id!: string;
    public pairing_id!: string;
    public url!: string;
    public match_number!: number;
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
})

export default Replay;