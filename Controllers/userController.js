const User = require('../Models/userModel');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email });

        // check if user email already exists in database
        if (existingUser) {
            console.log("User exists already");
            res.status(409).json(({ error: 'User Already Exists.' }));
            return;
        }

        // hashes password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        // add user to DB
        await user.save();

        console.log(`New User: ${name}, ${email}`);
        res.status(201).json({ message: 'User Created Successfully!' })

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        // if this email doesn't exist in DB...
        if (!user) {
            console.log("User Doesn't Exist");

            res.status(401).json({ error: 'User Doesnt Exist' });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        // return user as JSON
        if (passwordMatch) {
            res.status(200).json(user);
            console.log('User Returned to Sender');
        } else {
            res.status(400).json({error: 'Incorrect Password'});
            console.log('Incorrect Password');
        }

    } catch (err) {
        console.error(err);

        res.status(400).json({ error: err.message })
    }
}