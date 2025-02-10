import mongoose from 'mongoose';
import { app }  from './app';
import dotenv from 'dotenv';
import { runSeeder } from './data';
import { connectDb, db } from './db';
dotenv.config();
// Start the server on the specified port or 3000 if not provided.


const start = async () => {
    try {
        console.log('MongoDB URI:', process.env.MONGO_URI);
        await connectDb();  // Connect to MongoDB and run the seeder if in testing mode.
    } catch (err) {
        console.error(err)
    }
    app.listen(process.env.PORT || 3000, () => {
        console.log("Server is running on port: ",process.env.PORT);
    });
};

start();