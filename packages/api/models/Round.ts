import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import {v7 as uuidv7} from "uuid";

class Round extends Model {
    declare id: string;
    declare tournament_slug: string;
    declare round: number;
    declare name?: string;
    declare deadline: string;
}

Round.init({
    id: {
        type: DataTypes.UUID,
        defaultValue() {
            return uuidv7();
        },
        primaryKey: true
    },
    tournament_slug: {
        type: DataTypes.TEXT,
        allowNull: false,
        references: {
            model: 'tournament',
            key: 'slug'
        }
    },
    round: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.TEXT
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Round',
    tableName: 'round',
    indexes: [
        {
            unique: true,
            fields: ['tournament_slug', 'round']
        }
    ]
});

export default Round;