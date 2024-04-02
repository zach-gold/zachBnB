"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });
    }
  }
  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1,
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1,
        },
      },
      startDate: {
        type: DataTypes.DATEONLY,
        validate: {
          isDate: true,
          isAfter: "2024-04-01",
        },
      },
      endDate: {
        type: DataTypes.DATEONLY,
        validate: {
          isDate: true,
          // startDateAfterEndDate(value) {
          //   if (new Date(value) <=  new Date(this.startDate)) {
          //     throw new Error('Start date must be before the end date.');

          //   }
          // },
        },
      },
    },

    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
