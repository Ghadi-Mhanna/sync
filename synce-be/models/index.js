const config = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
const basename = path.basename(module.filename);

module.exports = (dbname) => {
  const sequelize = new Sequelize(dbname, config.USER, config.PASSWORD, {
    host: config.HOST,
    port: config.PORT || 3306,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle,
    },
    logging: false,
  });

  db = {};

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  /**Add the Database Models**/
  fs.readdirSync(__dirname)
    .filter(
      (file) =>
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-10) === ".models.js"
    )
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(sequelize, DataTypes);
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
};
