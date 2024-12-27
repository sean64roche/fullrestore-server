import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import EntrantPlayer from './EntrantPlayer';

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

Player.hasMany(EntrantPlayer, { foreignKey: 'player_id' });
EntrantPlayer.belongsTo(Player, { foreignKey: 'player_id' });

export default Player;