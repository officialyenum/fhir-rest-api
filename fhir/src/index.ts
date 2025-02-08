import mongoose from 'mongoose';
import { app }  from './app';
import dotenv from 'dotenv';
import { runSeeder } from './data';
dotenv.config();
// Start the server on the specified port or 3000 if not provided.


const start = async () => {
    try {
        console.log('MongoDB URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fhir', {});
        console.log('Connected to MongoDB : ', process.env.MONGO_URI);
        if (process.env.NODE_ENV === 'development') {
            if (mongoose.connection.db) {
                const collections = await mongoose.connection.db.collections();
                for (let collection of collections) {
                    await collection.deleteMany({});
                }
            }
            await runSeeder();
        }
    } catch (err) {
        console.error(err)
    }
    app.listen(process.env.PORT || 3000, () => {
        console.log("Server is running on port: ",process.env.PORT);
    });
};

const seedDB = async () => {
    // Code to seed the database goes here
}

start();