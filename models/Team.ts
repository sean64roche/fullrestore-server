import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Team extends Model {
    public id!: string;
    public name!: string;
}

Team.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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