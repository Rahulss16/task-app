const mongoose = require("mongoose");

const connectionURL = 'mongodb://127.0.0.1:27017/task-manager'

const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(connectionURL, {
            useNewUrlParser: true, useUnifiedTopology: true
        });
        console.log("Connected to DB !!");
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = InitiateMongoServer;