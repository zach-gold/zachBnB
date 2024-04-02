"use strict";
const { Spot } = require("../models");
const { faker } = require('@faker-js/faker');

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
    let spotsSeed = []

    // This for loop decides how many datapoints to create.
    // If you want to change the amount, just change the number in the for loop!
    for (let i = 1; i < 4; i++) {

      // The keys in this spot object are set equal to the fake information
      let newSpot = {
        ownerId: i,
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
        name: faker.company.catchPhrase(),
        description:
          faker.lorem.paragraph(),
        price: faker.commerce.price({min:3, max: 299, dec: 2}),
      }

      // For each fake spot you create, you're going to push them into the user array you declare above
      spotsSeed.push(newSpot)
    }

    await Spot.bulkCreate(spotsSeed);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  },
};
