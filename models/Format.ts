import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Format extends Model {
    public format!: string;
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

  export default Format;