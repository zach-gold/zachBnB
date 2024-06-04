"use strict";
const { Review } = require("../models");
const { faker } = require("@faker-js/faker");
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
    await Review.bulkCreate(
      [
        {
          spotId: 1,
          userId: 2,
          review: faker.lorem.sentence(),
          stars: 3,
        },
        {
          spotId: 2,
          userId: 3,
          review: faker.lorem.sentence(),
          stars: 4,
        },
        {
          spotId: 3,
          userId: 1,
          review: faker.lorem.sentence(),
          stars: 5,
        },
      ],
      {
        validate: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  },
};
