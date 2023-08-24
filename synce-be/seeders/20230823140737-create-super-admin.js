"use strict";
// For generating uuid
const { v4: uuidv4 } = require("uuid");
// Moment
const moment = require("moment/moment");
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        id: 1,
        uuid: uuidv4(),
        first_name: "Admin",
        last_name: "Admin",
        email: "admin@test.com",
        password: bcrypt.hashSync("Test123@", 10),
        role: "superAdmin",
        user_name: "super Admin",
        createdAt: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
      },
    ];

    await queryInterface.bulkInsert("Users", users);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
