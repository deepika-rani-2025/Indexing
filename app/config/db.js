const  mongoose = require('mongoose');

const connectdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('mongodb connected successfully');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectdb;