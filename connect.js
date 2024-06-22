const mongoose = require('mongoose')

async function connectToMongoDb(url) {
    try {
        await mongoose.connect(url);
       // console.log('Connected to MongoDB...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = {
    connectToMongoDb,
};
