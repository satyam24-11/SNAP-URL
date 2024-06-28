const express = require('express');
const { connectToMongoDb } = require('./connect');
const path = require('path');
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const URL = require('./models/url');

const app = express();
const port = 3001;

(async () => {
    try {
        await connectToMongoDb('mongodb://localhost:27017/url-shortener');
        console.log('Connected to MongoDB');

        app.set('view engine', 'ejs');
        app.set('views', path.resolve('./views'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        app.use('/url', urlRoute);
        app.use('/', staticRoute);

        app.get('/url/:shortId', async (req, res) => {
            try {
                const shortId = req.params.shortId;
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
