import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class PlayerAlias extends Model {
    declare player_id: string;
    declare ps_alias: string;
}

PlayerAlias.init({
    player_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'player',
            key: 'id'
        }
    },
    ps_alias: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isAlphanumeric: true
        },
        primaryKey: true
    }
}, {
    sequelize,
    modelName: 'PlayerAlias',
    tableName: 'player_alias',
    timestamps: false
});

export default PlayerAlias;