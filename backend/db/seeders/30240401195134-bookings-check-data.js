"use strict";
const { Booking } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; //define schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await Booking.bulkCreate([
      {
        //should work
        spotId: 1,
        userId: 1,
        startDate: "2024-04-03",
        endDate: "2024-04-04",
      },
      {
        //should also work
        spotId: 2,
        userId: 2,
        startDate: "2024-04-05",
        endDate: "2024-04-07",
      },
      // {
      //   //double booked spot
      //   spotId: 3,
      //   userId: 3,
      //   startDate: "2024-04-07",
      //   endDate: "2024-04-05",
      // },
    ]);


  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  },
};
