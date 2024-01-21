import express from "express";

const router = express.Router();

import usersRoute from "./user.js";
import postsRoute from "./post.js";
import articlesRoute from "./article.js";
import petsRoute from "./pet.js";
import writersRoute from "./writer.js";
import adminsRoute from "./admin.js";
import debugRoute from "./debug.js";

router.use("/users", usersRoute);
router.use("/posts", postsRoute);
router.use("/pets", petsRoute);
router.use("/articles", articlesRoute);
router.use("/writers", writersRoute);
router.use("/admins", adminsRoute);
router.use("/debug", debugRoute);

export default router;