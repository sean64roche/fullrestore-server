import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class PlayerAlias extends Model {
    declare player_id: string;
    declare alias: string;
    declare primary: boolean;
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
    alias: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        primaryKey: true
    },
    primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'PlayerAlias',
    tableName: 'player_alias',
    timestamps: false
});

export default PlayerAlias;