const Post = require('../Models/postModel');
const User = require('../Models/userModel');
const path = require('path');
const { imgPath } = require('../middlewares/imgStorage');

exports.newPost = async (req, res) => {
    try {
        const { email, title, content, tags } = req.body;

        // user selection here
        user = await User.findOne({ email: email });

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ Error: 'User not found' });
        }

        const images = await req.files;

        if (!images) {
            console.log("No Images Provided");
            return res.status(404).json({ Error: 'No Images Provided' });
        }

        const date = Date.now();

        const post = new Post({
            user: user._id,
            title,
            content,
            date,
            images: [], // empty for now
            tags: [], // empty for now
        });

        for (let i = 0; i < images.length; i++) {
            // Push each image location into the images array
            const location = path.join(imgPath, images[i].filename); // Convert to string
            post.images.push(location);

            // console.log(`adding : ${path.join(imgPath, images[i].filename)} image`);
        }

        for (let i = 0; i < tags.length; i++) {
            // Push each tag into the tags array
            const tag = tags[i];
            post.tags.push(tag);

            // console.log(`adding : ${tag} tag`);
        }

        await post.save();

        console.log('Post Added Successfully!');
        res.status(200).json({ message: 'Post Added Successfully!' });

    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
}