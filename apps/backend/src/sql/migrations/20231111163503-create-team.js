/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teams', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      country: { type: Sequelize.STRING(2), allowNull: true },
      team_name: { type: Sequelize.STRING, allowNull: false },
      min_availability: { type: Sequelize.DOUBLE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    await queryInterface.addIndex('teams', ['team_name'], {
      name: 'team_name_index',
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('teams', 'team_name_index');
    await queryInterface.dropTable('teams');
  },
};
