import { DataTypes, Model, ValidationError } from 'sequelize';
import sequelize from '../config/database';

class Tournament extends Model {
    public id!: string;
    public name!: string;
    public season!: string;
    public format!: string;
    public current_round?: number;
    public prize_pool?: number;
    public individual_winner?: string;
    public team_tour!: boolean;
    public team_winner?: string;
}

function winnersAreOverloaded() {
    return (this.individual_winner && this.team_winner);
}

function correctWinnerType() {
    return ((this.team_tour && this.individual_winner === null) || (!this.team_tour && this.team_winner === null));
}

Tournament.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
    current_round: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    prize_pool: {
        type: DataTypes.DECIMAL(2, 10)
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
    }
    
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
            if (!correctWinnerType()) {
                throw new ValidationError('Incorrect winner type for this tournament', []);
            }
        }
    }
});

export default Tournament;


