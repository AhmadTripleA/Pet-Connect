import chalk from "chalk";
import dotenv from "dotenv";
import mongoose from 'mongoose';

dotenv.config({
    path: '../config/config.env'
});

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(chalk.gray(`Database Connection Established!`));
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}