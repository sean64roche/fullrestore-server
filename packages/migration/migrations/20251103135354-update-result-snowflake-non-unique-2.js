'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.removeConstraint(
          'tournament',
          'tournament_result_snowflake_key',
      );
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.addConstraint(
          'tournament',
          {
              type: 'unique',
              name: 'tournament_result_snowflake_key',
              fields: ['result_snowflake'],
          }
      );
  }
};
