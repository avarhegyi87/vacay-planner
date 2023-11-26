/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('groups', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      teamid: { type: Sequelize.INTEGER, allowNull: false },
      group_name: { type: Sequelize.STRING, allowNull: false, unique: true },
      min_availability: { type: Sequelize.DOUBLE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    await queryInterface.addConstraint('groups', {
      fields: ['teamid'],
      type: 'foreign key',
      name: 'fk_teamid_groups',
      references: {
        table: 'teams',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addIndex('groups', ['group_name'], {
      name: 'group_name_index',
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('groups', 'fk_teamid_groups');
    await queryInterface.dropTable('groups');
  },
};
