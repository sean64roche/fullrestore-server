import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Content extends Model {
    declare url: string;
    declare pairing_id: string;
}

Content.init({
    url: {
        type: DataTypes.TEXT,
        validate: {
            isUrl: true,
            notEmpty: true,
        },
        allowNull: false,
        primaryKey: true,
    },
    pairing_id: {
        type: DataTypes.UUID,
        references: {
            model: 'pairing',
            key: 'id'
        },
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Content',
    tableName: 'content',
});

export default Content;