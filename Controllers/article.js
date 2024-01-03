const asyncErrorWrapper = require("express-async-handler")
const Writer = require('../Models/writer');
const Article = require("../Models/article");
const { resMsg, resErr } = require('../middlewares/general');

const add = asyncErrorWrapper(async (req, res, next) => {

    const { writerID, title, content } = req.body;

    const image = await req.file.filename;

    const writer = await Writer.findById(writerID)

    const article = new Article({
        writerID,
        author : writer.name,
        title,
        content,
        image
    });

    await article.save();

    console.log(`Article (${title}) Added Successfully!`);

    res.status(200).json({ articleID: article._id });
})

const remove = asyncErrorWrapper(async (req, res, next) => {

    const { articleID } = req.body.articleID;

    const article = await Article.findById(articleID);

    if (!article) {
        return resErr('This Article Doesnt Exist', 404, res);
    }

    const title = article.title;

    await Article.findByIdAndDelete(articleID);

    resMsg(`Article (${title}) Deleted Successfully!`, 200, res);
})

const getAll = asyncErrorWrapper(async (req, res, next) => {

    const articles = await Article.find();

    res.status(200).json(articles);
})

module.exports = {
    add,
    remove,
    getAll
}