import { DataTypes, Model, ValidationError } from 'sequelize';
import sequelize from '../config/database';
import {v7 as uuidv7} from 'uuid';

class Pairing extends Model {
    declare id: string;
    declare round_id: string;
    declare entrant1_id: string;
    declare entrant2_id: string;
    declare time_scheduled?: string;
    declare time_completed?: string;
    declare winner_id?: string;

}

function isValidWinner() {
    if (this.winner_id !== null) {
        return this.winner_id === this.entrant1_id || this.winner_id === this.entrant2_id;
    } else
    return true;
}

Pairing.init({
    id: {
        type: DataTypes.UUID,
        defaultValue() {
            return uuidv7();
        },
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
            model: 'entrant_player',
            key: 'id'
        },
        allowNull: false,
    },
    entrant2_id: {
        type: DataTypes.UUID,
        references: {
            model: 'entrant_player',
            key: 'id'
        },
        allowNull: false,
    },
    time_scheduled: {
        type: DataTypes.DATE
    },
    time_completed: {
        type: DataTypes.DATE
    },
    winner_id: {
        type: DataTypes.UUID,
        references: {
            model: 'entrant_player',
            key: 'id'
        },
    },
}, {
    sequelize,
    modelName: 'Pairing',
    tableName: 'pairing',
    validate: {
        uniqueUsers() {
            if ((this.entrant1_id === this.entrant2_id)) {
                if (this.entrant1_id === undefined || this.entrant2_id === undefined) return;
                else throw new ValidationError('Both entrants have the same username.', []);
            }
        },
        validWinner() {
            if (!isValidWinner()) {
                throw new ValidationError('Winner must be one of the entrants or null', []);
            }
        }
    },
});

export default Pairing;