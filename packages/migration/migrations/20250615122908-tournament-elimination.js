'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
        'tournament',
        'elimination',
        {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
    );
  },

  async down (queryInterface) {
    await queryInterface.removeColumn(
        'tournament',
        'elimination',
    )
  }
};
