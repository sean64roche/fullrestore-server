'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'tournament',
            'admin_snowflake',
            {
                type: Sequelize.STRING,
                unique: true
            },
        );
        await queryInterface.addColumn(
            'tournament',
            'signup_snowflake',
            {
                type: Sequelize.STRING,
                unique: true
            },
        );
        await queryInterface.addColumn(
            'tournament',
            'result_snowflake',
            {
                type: Sequelize.STRING,
                unique: true
            },
        );
    },

    async down (queryInterface) {
        await queryInterface.removeColumn(
            'tournament',
            'admin_snowflake',
        );
        await queryInterface.removeColumn(
            'tournament',
            'signup_snowflake',
        );
        await queryInterface.removeColumn(
            'tournament',
            'result_snowflake',
        );
    }
};

