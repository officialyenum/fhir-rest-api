import mongoose from 'mongoose';
import { app }  from './app';
import dotenv from 'dotenv';
import { runSeeder } from './data';
dotenv.config();
// Start the server on the specified port or 3000 if not provided.

let db: typeof mongoose | null = null;

const connectDb = async () => {
    try {
        if (!db) {

            console.log('MongoDB URI:', process.env.MONGO_URI);
            db = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fhir', {});
            console.log('Connected to MongoDB : ', process.env.MONGO_URI);
            if (process.env.NODE_ENV === 'testing') {
                if (db.connection.db) {
                    const collections = await db.connection.db.collections();
                    for (let collection of collections) {
                        await collection.deleteMany({});
                    }
                }
                await runSeeder();
            }
        }
        return db;
    } catch (err) {
        console.error(err)
    }
};


export { db, connectDb };