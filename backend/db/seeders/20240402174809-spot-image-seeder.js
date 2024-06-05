"use strict";
const { SpotImage } = require("../models");
const { faker } = require("@faker-js/faker");
let options = {};
let images = [];
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
    for (let i = 1; i < 9; i++) {
      for (let j = 0; j < 6; j++) {
        images.push({
          spotId: i,
          url: faker.image.url(),
          preview: true,
        });
      }
    }
    await SpotImage.bulkCreate(
      images,
      // [
      //   {
      //     spotId: 1,
      //     url: faker.image.url(),
      //     preview: true,
      //   },
      //   {
      //     spotId: 1,
      //     url: faker.image.url(),
      //     preview: true,
      //   },
      //   {
      //     spotId: 1,
      //     url: faker.image.url(),
      //     preview: true,
      //   },
      //   {
      //     spotId: 1,
      //     url: faker.image.url(),
      //     preview: true,
      //   },
      //   {
      //     spotId: 1,
      //     url: faker.image.url(),
      //     preview: true,
      //   },
      //   {
      //     spotId: 2,
      //     url: faker.image.url(),
      //     preview: true,
      //   },
      //   {
      //     spotId: 2,
      //     url: faker.image.url(),
      //     preview: true,
      //   },
      //   {
      //     spotId: 2,
      //     url: faker.image.url(),
      //     preview: true,
      //   },
      //   {
      //     spotId: 2,
      //     url: faker.image.url(),
      //     preview: true,
      //   },
      //   {
      //     spotId: 3,
      //     url: faker.image.url(),
      //     preview: true,
      //   },
      //   {
      //     spotId: 3,
      //     url: faker.image.url(),
      //     preview: true,
      //   },
      //   {
      //     spotId: 3,
      //     url: faker.image.url(),
      //     preview: true,
      //   },
      //   {
      //     spotId: 3,
      //     url: faker.image.url(),
      //     preview: true,
      //   },
      // ],
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
     */ options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  },
};
