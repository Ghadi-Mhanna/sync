const router = require("express").Router();

const {
  createCategory,
  updateCategory,
  getCategory,
  getAllCategories,
  deleteCategory,
} = require("../controllers/category.controller");

router.post("/create", createCategory);

router.put("/update/:uuid", updateCategory);

router.get("/get-one/:uuid", getCategory);

router.get("/get-all", getAllCategories);

router.delete("/delete/:uuid", deleteCategory);

module.exports = router;
