const config = require("../config/db.config");
const { Users } = require("../models")(config.DB);
const bcrypt = require("bcryptjs");

const { generateAccessToken } = require("../helpers/jwt.helpers");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({
        where: {
          email,
        },
      });

      if (!user)
        return res
          .status(403)
          .json({ message: "The provided credentials are incorrect" });

      if (!bcrypt.compareSync(password, user?.password)) {
        return res
          .status(403)
          .json({ message: "The provided credentials are incorrect" });
      }

      const loginUser = {
        uuid: user?.uuid,
        email: user?.email,
      };

      const access_token = generateAccessToken(loginUser);

      let finalUserData = {
        id: user?.id,
        uuid: user?.uuid,
        email: user?.email,
        first_name: user?.first_name,
        last_name: user?.last_name,
        role: user?.role,
        userName: user?.user_name,
      };

      return res.status(200).json({ access_token, user: finalUserData });
    } catch (err) {
      console.log("ERROR Login: ", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
};
