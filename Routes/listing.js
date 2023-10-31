const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {validateListing, isLoggedIn, isOwner} = require("../middleware.js");
const listingCtrl = require("../controller/listingCtrl.js");
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingCtrl.indexRender))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingCtrl.newListing));

router.get("/new",isLoggedIn, listingCtrl.renderNewListing);

router.route("/:id")
.get(wrapAsync(listingCtrl.showListing)) 
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingCtrl.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingCtrl.destroyListing));

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingCtrl.editListing));

module.exports = router;