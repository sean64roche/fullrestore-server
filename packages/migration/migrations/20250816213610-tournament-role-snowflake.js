'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.addColumn(
          'tournament',
          'role_snowflake',
          {
              type: Sequelize.STRING,
              unique: true
          },
      );
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.removeColumn(
          'tournament',
          'role_snowflake',
      );
  }
};
