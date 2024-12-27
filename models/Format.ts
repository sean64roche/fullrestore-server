import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Tournament from './Tournament';

class Format extends Model {
    declare format: string;
}

Format.init({
    format: {
        type: DataTypes.STRING,
        primaryKey: true
    }
},  {
    sequelize,
    modelName: 'Format',
    tableName: 'format',
    timestamps: false
  });

Format.hasMany(Tournament, { foreignKey: 'format' });

export default Format;