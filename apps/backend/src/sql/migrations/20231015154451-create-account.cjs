'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accounts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      userid: { type: Sequelize.INTEGER, allowNull: false },
      provider: { type: Sequelize.STRING, allowNull: false },
      accountid: { type: Sequelize.STRING, allowNull: true },
      expiration: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addConstraint('accounts', {
      fields: ['userid'],
      type: 'foreign key',
      name: 'fk_userid_accounts',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addIndex('accounts', ['userid'], {
      name: 'userid_index',
      unique: true,
    });

    await queryInterface.addIndex('accounts', ['userid', 'provider'], {
      name: 'userid_provider_index',
      unique: true,
    });

    await queryInterface.addIndex('accounts', ['accountid'], {
      name: 'accountid_index',
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('accounts', 'accountid_index');
    await queryInterface.removeIndex('accounts', 'userid_provider_index');
    await queryInterface.removeIndex('accounts', 'userid_index');
    await queryInterface.removeConstraint('accounts', 'fk_userid_accounts');
    await queryInterface.dropTable('accounts');
  },
};
