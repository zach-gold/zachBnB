'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
const { User } = require('../models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Spots",
          key: "id",
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
      options
    );
  },
  //   await queryInterface.addConstraint("Bookings", {
  //     type: "unique",
  //     fields: ["spotId", "userId", "startDate", "endDate"],
  //     name: "no_double_booking_user",
  //   });


  //   await queryInterface.addConstraint("Bookings", {
  //     type: "unique",
  //     fields: ["spotId", "startDate"],
  //     name: "no_double_booking_spot"
  //   })
  // },
  async down(queryInterface, Sequelize) {
    options.tableName ="Bookings"
    await queryInterface.dropTable(options);
  }
};
