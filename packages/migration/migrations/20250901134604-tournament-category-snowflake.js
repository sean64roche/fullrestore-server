'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'tournament',
            'category_snowflake',
            {
                type: Sequelize.STRING,
                unique: true
            },
        );
    },

    async down(queryInterface) {
        await queryInterface.removeColumn(
            'tournament',
            'category_snowflake',
        );
    }
};