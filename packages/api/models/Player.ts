import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Player extends Model {
  declare id: string;
  declare ps_user: string;
  declare discord_user?: string;
  declare discord_id?: string;
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
        notEmpty: true,
    }
  },
  discord_user: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
        notEmpty: true,
        is: /^[a-zA-Z0-9._]+$/
    }
  },
  discord_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      notEmpty: true,
      isNumeric: true,
    }
  }
}, {
  sequelize,
  modelName: 'Player',
  tableName: 'player',
  timestamps: false
});

export default Player;
