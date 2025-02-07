import mongoose from 'mongoose';
import { app }  from './app';
import dotenv from 'dotenv';
dotenv.config();
// Start the server on the specified port or 3000 if not provided.


const start = async () => {
    try {
        console.log('MongoDB URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fhir', {});
        console.log('Connected to MongoDB : ', process.env.MONGO_URI);
    } catch (err) {
        console.error(err)
    }
    app.listen(process.env.PORT || 3000, () => {
        console.log("Server is running on port: ",process.env.PORT);
    });
};

start();