const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewCtrl = require("../controller/reviewCtrl.js")

// @ create review route
  
router.post("/",validateReview,isLoggedIn, wrapAsync(reviewCtrl.createReview));
  
//@ review delete route
  
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewCtrl.destroyReview));


module.exports = router;