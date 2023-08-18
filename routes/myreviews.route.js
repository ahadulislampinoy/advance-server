const express = require("express");
const router = express.Router();
const myreviewsController = require("../controllers/myreviews.controller.js");

// Routes
router
  .route("/")
  .get(myreviewsController.getAllMyReviews)
  .post(myreviewsController.postMyReviews);
router.route("/:id").delete(myreviewsController.deleteMyReviews);
router.route("/:id").patch(myreviewsController.patchMyReviews);
// Export
module.exports = router;
