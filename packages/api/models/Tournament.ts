import { DataTypes, Model, ValidationError } from 'sequelize';
import sequelize from '../config/database';

class Tournament extends Model {
    declare slug: string;
    declare name: string;
    declare season: string;
    declare format: string;
    declare winner_first_to?: number;
    declare current_round?: number;
    declare prize_pool?: number;
    declare individual_winner?: string;
    declare team_tour: boolean;
    declare team_winner?: string;
    declare info?: string;
    declare start_date: string;
    declare finish_date?: string;
}

function winnersAreOverloaded() {
    return (this.individual_winner && this.team_winner);
}

function correctWinnerType() {
    return ((this.team_tour && this.individual_winner === null) || (!this.team_tour && this.team_winner === null));
}

Tournament.init({
    slug: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    season: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    format: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    winner_first_to: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    current_round: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    prize_pool: {
        type: DataTypes.DECIMAL
    },
    individual_winner: {
        type: DataTypes.UUID,
        references: {
            model: 'player',
            key: 'id'
        },
    },
    team_tour: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    team_winner: {
        type: DataTypes.UUID,
        references: {
            model: 'team',
            key: 'id'
        }
    },
    info: {
        type: DataTypes.TEXT,
    }
    ,
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    finish_date: {
        type: DataTypes.DATE
    },
}, {
    sequelize,
    modelName: 'Tournament',
    tableName: 'tournament',
    indexes: [
        {
            unique: true,
            fields: ['name', 'season']
        }
    ],
    validate: {
        isOnlyIndividualOrTeam() {
            if (winnersAreOverloaded()) {
                throw new ValidationError('Winner must be only either individual or team', []);
            }
        },
        isCorrectWinnerType() {
            if (correctWinnerType()) {
                throw new ValidationError('Incorrect winner type for this tournament', []);
            }
        }
    }
});

export default Tournament;
