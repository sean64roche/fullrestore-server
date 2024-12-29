import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class PlayerAlias extends Model {
    declare player_id: string;
    declare ps_alias: string;
}

PlayerAlias.init({
    player_id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    ps_alias: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
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