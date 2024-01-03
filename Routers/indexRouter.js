const express = require("express")

const router = express.Router()

const userRoute = require("./userRouter")
const postsRoute = require("./postRouter")
const articlesRoute = require("./articleRouter")
const petsRoute = require("./petRouter")
const writerRoute = require("./writer")

router.use("/users", userRoute)
router.use("/posts", postsRoute)
router.use("/pets", petsRoute)
router.use("/articles", articlesRoute)
router.use("/writers", writerRoute)

module.exports = router