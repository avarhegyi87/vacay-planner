'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('team_memberships', {
      UserId: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: false,
        primaryKey: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      TeamId: {
        type: Sequelize.INTEGER,
        references: { model: 'teams', key: 'id' },
        allowNull: false,
        primaryKey: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      is_team_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('team_memberships');
  },
};
