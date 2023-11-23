'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tokens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      userid: { type: Sequelize.INTEGER, allowNull: false },
      token: { type: Sequelize.STRING, allowNull: false },
      expire_at: { type: Sequelize.DATE },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('tokens', {
      fields: ['userid'],
      type: 'foreign key',
      name: 'fk_userid_tokens',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('tokens', 'fk_userid_tokens');
    await queryInterface.dropTable('tokens');
  },
};
