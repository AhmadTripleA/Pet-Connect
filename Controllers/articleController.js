const asyncErrorWrapper = require("express-async-handler")
const User = require('../Models/userModel');
const { resMsg, resErr } = require('../middlewares/general');
const Article = require("../Models/articleModel");

const addArticle = asyncErrorWrapper(async (req, res, next) => {

    const { userID, title, content } = req.body;

    const image = await req.file.filename;

    console.log(image)

    const article = new Article({
        userID,
        title,
        content,
        image
    });

    await article.save();

    res.status(200).json({ userID: article._id })

})

const getAll = asyncErrorWrapper(async (req, res, next) => {

    const user = await User.findById(req.body.userID);

    if (!user) {
        resErr("Authentication Failed", 400, res);
    }

    const articles = await Article.find();

    res.status(200).json(articles);
})

module.exports = {
    addArticle,
    getAll
}