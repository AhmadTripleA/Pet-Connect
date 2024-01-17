const asyncErrorWrapper = require("express-async-handler")
const Writer = require('../Models/writer');
const Article = require("../Models/article");
const { resMsg, resErr } = require('../middlewares/general');

const add = asyncErrorWrapper(async (req, res, next) => {
    try {
        const { writerID, title, content } = req.body;

        const image = await req.file.filename;

        const writer = await Writer.findById(writerID)

        const article = new Article({
            writerID,
            author: writer.name,
            title,
            content,
            image
        });

        await article.save();

        console.log(`Article (${title}) Added Successfully!`);

        res.status(200).json({ articleID: article._id });
    } catch (err) {
        deleteImageFile(req, req.file.filename)
        resErr(`Error Creating Article - ${err}`, 400, res);
    }

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

    console.log(`Sent (${articles.length}) Articles`)
    res.status(200).json(articles);
})

const filter = asyncErrorWrapper(async (req, res, next) => {
    const { query, limit } = req.body;

    const articles = await Article.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } }
        ]
    })
        .limit(limit)
        .sort({ createdAt: -1 });

    console.log(`Filter: ${query} | limit: ${limit} | ${articles.length} Articles Sent`);
    res.status(200).json(articles);
})

const getArticle = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    try {
        const article = await Article.findById(id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        console.log(`Article ${id} Sent!`);
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = {
    add,
    remove,
    getAll,
    filter,
    getArticle,
}