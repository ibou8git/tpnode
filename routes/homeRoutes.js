const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

// Routes pour les pages principales
router.get("/", homeController.index);
router.get("/about", homeController.about);
router.get("/contact", homeController.contact);
router.post("/contact", homeController.processContact);

module.exports = router;