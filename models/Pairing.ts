import { DataTypes, Error, Model, Sequelize, ValidationError } from 'sequelize';
import sequelize from '../config/database';

class Pairing extends Model {
    public id!: string;
    public round_id!: string;
    public entrant1_id!: string;
    public entrant2_id!: string;
    public time_scheduled?: string;
    public time_completed?: string;
    public winner_id?: string;

}

function isValidWinner() {
    if (this.winner_id !== null) {
        // Check if winner is either entrant1 or entrant2
        return this.winner_id === this.entrant1_id || this.winner_id === this.entrant2_id;
    } else
    return true;
}

Pairing.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    round_id: {
        type: DataTypes.UUID,
        references: {
            model: 'round',
            key: 'id'
        },
        allowNull: false
    },
    entrant1_id: {
        type: DataTypes.UUID,
        references: {
            model: 'player',
            key: 'id'
        },
        allowNull: false,
    },
    entrant2_id: {
        type: DataTypes.UUID,
        references: {
            model: 'player',
            key: 'id'
        },
        allowNull: false,
        validate: {
        }
    },
    time_scheduled: {
        type: DataTypes.TIME
    },
    time_completed: {
        type: DataTypes.TIME
    },
    winner_id: {
        type: DataTypes.UUID,
        references: {
            model: 'player',
            key: 'id'
        },
    }
}, {
    sequelize,
    modelName: 'Pairing',
    tableName: 'pairing',
    validate: {
        uniqueUsers() {
            if (!(this.entrant1_id === this.entrant2_id)) {
                throw new ValidationError('Both entrants have the same username.', []);
            }
        },
        validWinner() {
            if (isValidWinner()) {
                throw new ValidationError('Winner must be one of the entrants or null', []);
            }
        }
    }
});

export default Pairing;