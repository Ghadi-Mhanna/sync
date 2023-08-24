const config = require("../config/db.config");
const { News, Categories, Images, Users } = require("../models")(config.DB);
const moment = require("moment");

module.exports = {
  createNews: async (req, res) => {
    try {
      const user = req?.user;

      if (!user) {
        return res.status(404).json({ message: "User not Found" });
      }

      const { title, content, categoryUuid, date, imagePaths } = req?.body;

      const category = await Categories.findOne({
        where: {
          uuid: categoryUuid,
        },
      });

      if (!category) {
        return res.status(404).json({ message: "Category not Found" });
      }

      const news = await News.create({
        title,
        content,
        category_id: category?.id,
        date: moment(date).format("YYYY-MM-DD HH:mm:ss"),
        added_by: user?.id,
      });

      if (!news) {
        return res.status(400).json({ message: "Error Creating News" });
      }

      const imagesToCreate = imagePaths.map((path) => ({
        title,
        path,
        news_id: news.id,
      }));

      await Images.bulkCreate(imagesToCreate);

      return res.status(200).json({ data: news });
    } catch (err) {
      console.log("Error Creating News: ", err);
      return res.status(500).json({ message: err });
    }
  },

  updateNews: async (req, res) => {
    try {
      const user = req?.user;

      if (!user) {
        return res.status(404).json({ message: "User not Found" });
      }

      const { uuid } = req?.params;
      const { title, content, categoryUuid, date, imagePaths } = req?.body;

      const category = await Categories.findOne({
        where: {
          uuid: categoryUuid,
        },
      });

      if (!category) {
        return res.status(404).json({ message: "Category not Found" });
      }

      const news = await News.findOne({
        where: { uuid },
      });

      if (!news) {
        return res.status(404).json({ message: "News not Found" });
      }

      await news.update({
        title,
        content,
        date: moment(date).format("YYYY-MM-DD HH:mm:ss"),
        category_id: category?.id,
        added_by: user?.id,
      });

      const images = await Images.findAll({
        where: {
          news_id: news?.id,
        },
      });

      if (!images || images.length === 0) {
        return res.status(404).json({ message: "No Images Found" });
      }

      if (imagePaths.length > 0) {
        for (let i = 0; i < imagePaths.length; i++) {
          const path = imagePaths[i];

          const existingImage = images.find((img) => img.path === path);

          if (existingImage) {
            if (existingImage.path !== path) {
              await existingImage.update({ title, path }); // Assuming your Image model has an 'update' method
            }
          } else {
            // Create a new image with the given path for the news article
            await Images.create({
              title,
              path,
              news_id: news.id,
            });
          }
        }
      }

      return res.status(200).json({ data: news });
    } catch (err) {
      console.log("Error Updating News: ", err);
      return res.status(500).json({ message: err });
    }
  },

  getNews: async (req, res) => {
    try {
      const { user, params } = req;
      const { uuid } = params;

      if (!user) {
        return res.status(404).json({ message: "User not Found" });
      }

      const newsQuery = {
        where: { uuid },
        include: [
          {
            model: Images,
          },
          {
            model: Categories,
          },
          {
            model: Users,
          },
        ],
      };

      if (user?.role === "user") {
        newsQuery.where.added_by = user.id;
      }

      const news = await News.findOne(newsQuery);

      if (!news) {
        return res.status(404).json({ message: "News Not Found" });
      }

      return res.status(200).json({ data: news });
    } catch (err) {
      console.log("Error Getting News: ", err);
      return res.status(500).json({ message: err });
    }
  },

  getAllNews: async (req, res) => {
    try {
      const { user } = req;

      if (!user) {
        return res.status(404).json({ message: "User not Found" });
      }

      const newsQuery = {
        include: [
          {
            model: Images,
          },
          {
            model: Categories,
          },
          {
            model: Users,
          },
        ],
      };

      if (user?.role === "user") {
        newsQuery.where = { added_by: user.id };
      }

      const newsList = await News.findAll(newsQuery);

      if (!newsList || newsList.length === 0) {
        return res.status(404).json({ message: "No News Found" });
      }

      return res.status(200).json({ data: newsList });
    } catch (err) {
      console.log("Error Getting News List: ", err);
      return res.status(500).json({ message: err });
    }
  },

  deleteNews: async (req, res) => {
    try {
      const { uuid } = req?.params;

      await News.destroy({
        where: { uuid },
      });

      return res.status(200).json({ message: "Deleting News Successfully" });
    } catch (err) {
      console.log("Error Deleting News: ", err);
      return res.status(500).json({ message: err });
    }
  },
};
