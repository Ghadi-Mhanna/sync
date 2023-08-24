const {
  authenticateUserToken,
} = require("../middlewares/authentication.middleware");

const auth = require("./auth.route");
const users = require("./user.route");
const categories = require("./category.route");
const news = require("./news.route");

module.exports = (app) => {
  app.use("/auth", auth);

  app.use("/users", authenticateUserToken, users);

  app.use("/categories", authenticateUserToken, categories);

  app.use("/news", authenticateUserToken, news);
};
