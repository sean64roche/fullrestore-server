import { DataTypes, INTEGER, Model } from 'sequelize';
import sequelize from '../config/database';

class Round extends Model {
    public id!: string;
    public tournament_id!: string;
    public round!: number;
    public name?: string;
    public deadline!: string;
}

Round.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    tournament_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'tournament',
            key: 'id'
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
            fields: ['tournament_id', 'round']
        }
    ]
})

export default Round;