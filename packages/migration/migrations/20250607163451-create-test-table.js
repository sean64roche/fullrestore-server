'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await (queryInterface.createTable('test', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUID, primaryKey: true },
      name: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    }));
  },

  async down (queryInterface) {
    await queryInterface.dropTable('Test');
  }
};
