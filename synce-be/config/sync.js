require("dotenv").config();
const mysql = require("mysql2/promise");
const config = require("./db.config");
const db = require("../models")(config.DB);

(async () => {
  const connection = await mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB,
    port: config.PORT,
  });

  try {
    console.log("CONNECTION START...");
    await connection.connect();
    console.log("CONNECTION ESTABLISHED...");

    console.log("#############################");
    console.log("########### SYNC DB ##########");
    console.log("#############################");

    await db.sequelize.sync({ alter: true });

    console.log("SYNC DONE");
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    if (connection) {
      connection.end();
      console.log("CONNECTION CLOSED");
    }
  }
})();
