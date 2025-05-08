import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Replay extends Model {
    declare url: string;
    declare pairing_id: string;
    declare match_number: number;
}

Replay.init({
    url: {
        type: DataTypes.TEXT,
        validate: {
            isUrl: true,
            notEmpty: true,
            is: {
                args: /^(?!.*\?p2$).*/,
                msg: 'illegal URL with \'?p2\' suffix'
            }
        },
        allowNull: false,
        primaryKey: true,
    },
    pairing_id: {
        type: DataTypes.UUID,
        references: {
            model: 'pairing',
            key: 'id'
        },
        allowNull: false
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