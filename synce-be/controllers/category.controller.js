const config = require("../config/db.config");
const { Categories } = require("../models")(config.DB);

module.exports = {
  createCategory: async (req, res) => {
    try {
      const superAdmin = req?.user;

      if (superAdmin?.role !== "superAdmin") {
        return res.status(400).json({ message: "User is not a super admin" });
      }

      const { title, descriptions } = req?.body;

      const category = await Categories.create({
        title,
        descriptions: descriptions || null,
      });

      if (!category) {
        return res.status(400).json({ message: "Error Creating Category" });
      }

      return res.status(200).json({ data: category });
    } catch (err) {
      console.log("Error Creating Category: ", err);
      return res.status(500).json({ message: err });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const superAdmin = req?.user;

      if (superAdmin?.role !== "superAdmin") {
        return res.status(400).json({ message: "User is not a super admin" });
      }

      const { uuid } = req?.params;
      const { title, descriptions } = req?.body;

      const category = await Categories.update(
        {
          title,
          descriptions: descriptions || null,
        },
        {
          where: { uuid },
          returning: true,
          plain: true,
        }
      );

      return res.status(200).json({ data: category[1] });
    } catch (err) {
      console.log("Error Updating Category: ", err);
      return res.status(500).json({ message: err });
    }
  },

  getCategory: async (req, res) => {
    try {
      const superAdmin = req?.user;

      if (superAdmin?.role === "user") {
        return res.status(400).json({ message: "User has no permission here" });
      }

      const { uuid } = req?.params;

      const category = await Categories.findOne({
        where: { uuid },
      });

      if (!category) {
        return res.status(404).json({ message: "Category Not Found" });
      }

      return res.status(200).json({ data: category });
    } catch (err) {
      console.log("Error Getting Category: ", err);
      return res.status(500).json({ message: err });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const superAdmin = req?.user;

      if (superAdmin?.role === "user") {
        return res.status(400).json({ message: "User has no permission here" });
      }

      const categories = await Categories.findAll();

      if (!categories || categories.length === 0) {
        return res.status(404).json({ message: "No Categories Found" });
      }

      return res.status(200).json({ data: categories });
    } catch (err) {
      console.log("Error Getting All Categories: ", err);
      return res.status(500).json({ message: err });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const superAdmin = req?.user;

      if (superAdmin?.role !== "superAdmin") {
        return res.status(400).json({ message: "User is not a super admin" });
      }

      const { uuid } = req?.params;

      await Categories.destroy({
        where: { uuid },
      });

      return res
        .status(200)
        .json({ message: "Deleting Category Successfully" });
    } catch (err) {
      console.log("Error Deleting Category: ", err);
      return res.status(500).json({ message: err });
    }
  },
};
