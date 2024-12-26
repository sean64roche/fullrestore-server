import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Player extends Model {
  declare id: string;
  declare ps_user: string;
  declare discord_user?: string;
}

Player.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ps_user: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
        notEmpty: true
    }
  },
  discord_user: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
        notEmpty: true,
        isAlphanumeric: true
    }
  }
}, {
  sequelize,
  modelName: 'Player',
  tableName: 'player',
  timestamps: false
});

export default Player;