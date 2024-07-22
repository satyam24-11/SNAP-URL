
const express = require('express');
const { connectToMongoDb } = require('./connect');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Ensure this is at the top to load env variables

const { checkForAuthentication, restrictTo } = require('./middlewares/auth');
const URL = require('./models/url');
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

const app = express();
const port = process.env.PORT || 3000;

(async () => {
    try {
        const mongoUri = process.env.MONGODB_CONNECT_URI;
        await connectToMongoDb(mongoUri); 

        app.set('view engine', 'ejs');
        app.set('views', path.resolve('./views'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        app.use(cookieParser());
        app.use(checkForAuthentication);

        app.use('/url', restrictTo(["NORMAL", "ADMIN"]), urlRoute);
        app.use('/user', userRoute);
        app.use('/', staticRoute);

        app.get('/url/:shortId', async (req, res) => {
            try {
                const shortId = req.params.shortId;
                console.log('shortId:', shortId);
                const entry = await URL.findOneAndUpdate({
                    shortId,
                }, {
                    $push: {
                        visitHistory: {
                            timestamp: Date.now(),
                            // ipAddress: req.ip,
                        },
                    },
                }, { new: true }); // Ensure the updated document is returned

                if (entry) {
                    res.redirect(entry.redirectUrl);
                } else {
                    res.status(404).send('URL not found');
                }
            } catch (error) {
                console.error('Error fetching URL:', error);
                res.status(500).send('Server error');
            }
        });

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit the process if the connection fails
    }
})();
