import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import {v7 as uuidv7} from "uuid";

class Team extends Model {
    declare id: string;
    declare name: string;
}

Team.init({
    id: {
        type: DataTypes.UUID,
        defaultValue() {
            return uuidv7();
        },
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'Team',
    tableName: 'team',
    timestamps: false
});

export default Team;