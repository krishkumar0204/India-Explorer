const express = require("express");
const asyncWrap = require("../util/AsyncWrap.js");
const router = express.Router();
const exploreController = require("../controllers/explore.js");
const { validateExplore, isLoggedIn, isOwner } = require("../Middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/", asyncWrap(exploreController.Index));
router.get("/new", isLoggedIn, exploreController.newForm);
router.post(
  "/new",
  isLoggedIn,
  upload.fields([
    { name: "explore[image][url1]" },
    { name: "explore[image][url2]" },
    { name: "explore[image][url3]" },
    { name: "explore[image][url4]" },
    { name: "explore[image][url5]" },
  ]),
  validateExplore,
  asyncWrap(exploreController.newPlace)
);
router.get("/:id", asyncWrap(exploreController.showPlace));
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(exploreController.editForm));
router.patch(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.fields([
    { name: "explore[image][url1]" },
    { name: "explore[image][url2]" },
    { name: "explore[image][url3]" },
    { name: "explore[image][url4]" },
    { name: "explore[image][url5]" },
  ]),
  validateExplore,
  asyncWrap(exploreController.editPlace)
);
router.delete("/:id", isLoggedIn, isOwner, asyncWrap(exploreController.deletePlace));



module.exports = router;
