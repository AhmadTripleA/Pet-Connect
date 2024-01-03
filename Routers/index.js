const express = require("express")

const router = express.Router()

const userRoute = require("./user")
const postsRoute = require("./post")
const articlesRoute = require("./article")
const petsRoute = require("./pet")
const writerRoute = require("./writer")

router.use("/users", userRoute)
router.use("/posts", postsRoute)
router.use("/pets", petsRoute)
router.use("/articles", articlesRoute)
router.use("/writers", writerRoute)

module.exports = router