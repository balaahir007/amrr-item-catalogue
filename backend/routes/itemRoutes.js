const express = require("express");
const { getItems, addItem, enquireItem } = require("../controllers/itemsControllers");

const router = express.Router();

// Chain GET and POST for /
router.route("/").get(getItems).post(addItem);

// Single route for /enquire
router.post("/enquire", enquireItem);

module.exports = router;
