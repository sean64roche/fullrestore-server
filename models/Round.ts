import { DataTypes, INTEGER, Model } from 'sequelize';
import sequelize from '../config/database';
import Pairing from './Pairing';

class Round extends Model {
    declare id: string;
    declare tournament_id: string;
    declare round: number;
    declare name?: string;
    declare deadline: string;
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
});

Round.hasMany(Pairing, { foreignKey: 'round_id', onDelete: 'CASCADE' });
Pairing.belongsTo(Round, { foreignKey: 'round_id' });

export default Round;