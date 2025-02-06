import mongoose from 'mongoose';
import { app }  from './app';
// Start the server on the specified port or 3000 if not provided.


const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fhir', {});
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err)
    }
    app.listen(process.env.PORT || 3000, () => {
        console.log("Server is running on port 3000");
    });
};

start();