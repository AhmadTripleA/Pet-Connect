const express = require('express');
const mongoose = require('mongoose');

const debugSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        default: "username"
    },
    content: {
        type: String,
        required: true,
        default: "content"
    },
    image: {
        type: String,
        required: true,
        default: "default.png"
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, { timestamps: true });

const Debug = mongoose.model("debug", debugSchema);

const router = express.Router();

router.get('/get', async (req, res) => {
    try {
        const users = await Debug.find();

        if (users) {
            res.status(200).json(users);
        } else {
            res.status(404).json({ "error": "We can't find any post" });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/post', async (req, res) => {
    try {
        const user = req.body.user;

        const debug = new Debug({
            user
        })

        await debug.save();

        if (debug) {
            res.status(200).json({ "message ": "Nicely Done!" });
        } else {
            res.status(404).json({ "error": "We can't find any post" });
        }
    } catch (error) {
        console.log(error);
    }
});

router.delete('/delete', async (req, res) => {
    try {

        await Debug.findOneAndDelete({}, { sort: { createdAt: -1 } });

        res.status(200).json({ "message ": "Deleted" });

    } catch (error) {
        console.log(error);
    }
});


module.exports = router;