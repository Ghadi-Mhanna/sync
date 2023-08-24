const router = require("express").Router();

const {
  createUser,
  updateUser,
  getUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/user.controller");

router.post("/create", createUser);

router.put("/update/:uuid", updateUser);

router.get("/get-one/:uuid", getUser);

router.get("/get-all", getAllUsers);

router.delete("/delete/:uuid", deleteUser);

module.exports = router;
