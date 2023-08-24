const jwt = require("jsonwebtoken");
const config = require("../config/db.config");
const { Users } = require("../models")(config.DB);

const authenticateUserToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(422).json({ message: "Validation Error" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(422).json({ message: "Validation Error" });
    }

    const user = await Users.findOne({
      where: {
        uuid: userInfo?.uuid,
      },
    });

    if (!user) return res.status(422).json({ message: "Validation Error" });

    req.user = user;
    return next();
  });
};

module.exports = {
  authenticateUserToken,
};
