const express = require("express");
const router = express.Router();
const servicesController = require("../controllers/services.controller.js");

// Routes
router
  .route("/")
  .get(servicesController.getAllServices)
  .post(servicesController.postAService);

router.route("/:id").get(servicesController.getASpecificService);

module.exports = router;
