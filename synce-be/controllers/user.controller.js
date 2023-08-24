const config = require("../config/db.config");
const { Users } = require("../models")(config.DB);

module.exports = {
  createUser: async (req, res) => {
    try {
      const superAdmin = req?.user;

      if (superAdmin?.role !== "superAdmin") {
        return res.status(400).json({ message: "User is not a super admin" });
      }

      const { firstName, lastName, email, password, role, userName } =
        req?.body;

      const user = await Users.create({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role,
        user_name: userName,
      });

      if (!user) {
        return res.status(400).json({ message: "Error Creating User" });
      }

      return res.status(200).json({ data: user });
    } catch (err) {
      console.log("Error Creating User: ", err);
      return res.status(500).json({ message: err });
    }
  },

  updateUser: async (req, res) => {
    try {
      const superAdmin = req?.user;

      if (superAdmin?.role !== "superAdmin") {
        return res.status(400).json({ message: "User is not a super admin" });
      }

      const { uuid } = req?.params;
      const { firstName, lastName, email, password, role, userName } =
        req?.body;

      const user = await Users.update(
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          role,
          user_name: userName,
        },
        {
          where: { uuid },
          returning: true,
          plain: true,
        }
      );

      return res.status(200).json({ data: user[1] });
    } catch (err) {
      console.log("Error Updating User: ", err);
      return res.status(500).json({ message: err });
    }
  },

  getUser: async (req, res) => {
    try {
      const superAdmin = req?.user;

      if (superAdmin?.role === "user") {
        return res.status(400).json({ message: "User has no permission here" });
      }

      const { uuid } = req?.params;

      const user = await Users.findOne({
        where: { uuid },
      });

      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }

      return res.status(200).json({ data: user });
    } catch (err) {
      console.log("Error Getting User: ", err);
      return res.status(500).json({ message: err });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const superAdmin = req?.user;

      if (superAdmin?.role === "user") {
        return res.status(400).json({ message: "User has no permission here" });
      }

      const users = await Users.findAll();

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No Users Found" });
      }

      return res.status(200).json({ data: users });
    } catch (err) {
      console.log("Error Getting All Users: ", err);
      return res.status(500).json({ message: err });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const superAdmin = req?.user;

      if (superAdmin?.role !== "superAdmin") {
        return res.status(400).json({ message: "User is not a super admin" });
      }

      const { uuid } = req?.params;

      await Users.destroy({
        where: { uuid },
      });

      return res.status(200).json({ message: "Deleting User Successfully" });
    } catch (err) {
      console.log("Error Deleting User: ", err);
      return res.status(500).json({ message: err });
    }
  },
};
