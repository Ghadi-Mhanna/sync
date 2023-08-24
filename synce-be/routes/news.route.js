const router = require("express").Router();

const {
  createNews,
  updateNews,
  getNews,
  getAllNews,
  deleteNews,
} = require("../controllers/news.controller");

router.post("/create", createNews);

router.put("/update/:uuid", updateNews);

router.get("/get-one/:uuid", getNews);

router.get("/get-all", getAllNews);

router.delete("/delete/:uuid", deleteNews);

module.exports = router;
