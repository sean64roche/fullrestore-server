'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn(
          'tournament',
          'signup_start_date',
          {
            type: Sequelize.DATE,
          },
      ),
      queryInterface.addColumn(
          'tournament',
          'signup_finish_date',
          {
            type: Sequelize.DATE,
          },
      )
    ]);
  },

  async down (queryInterface) {
    await Promise.all([
      queryInterface.removeColumn(
          'tournament',
          'signup_start_date',
      ),
      queryInterface.removeColumn(
          'tournament',
          'signup_finish_date',
      )
    ]);
  }
};
