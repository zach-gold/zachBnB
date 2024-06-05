"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    let userSeed = [];

    // This for loop decides how many datapoints to create.
    // If you want to change the amount, just change the number in the for loop!
    for (let i = 1; i < 10; i++) {
      // The keys in this user object are set equal to the fake information
      let newUser = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        hashedPassword: bcrypt.hashSync(`password${i}`),
      };

      // For each fake user you create, you're going to push them into the user array you declare above
      userSeed.push(newUser);
    }

    let demoUser = {
      firstName: "Demo",
      lastName: "Lition",
      email: "demo@user.io",
      username: "Demo-lition",
      hashedPassword: bcrypt.hashSync("password"),
    };
    userSeed.push(demoUser);

    await User.bulkCreate(userSeed, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  },
};
