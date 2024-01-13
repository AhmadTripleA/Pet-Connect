const express = require("express");

const router = express.Router();

const usersRoute = require("./user");
const postsRoute = require("./post");
const articlesRoute = require("./article");
const petsRoute = require("./pet");
const writersRoute = require("./writer");
const adminsRoute = require("./admin");
const debugRoute = require("./debug");

router.use("/users", usersRoute);
router.use("/posts", postsRoute);
router.use("/pets", petsRoute);
router.use("/articles", articlesRoute);
router.use("/writers", writersRoute);
router.use("/admins", adminsRoute);
router.use("/debug", debugRoute);

module.exports = router;