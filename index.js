const express = require('express');
const { connectToMongoDb } = require('./connect');
const urlRoute = require('./routes/url');

const URL = require('./models/url');
const app = express();
const port = 3001;


connectToMongoDb('mongodb://localhost:27017/url-shortener')
    .then(() =>
        console.log('Connected to MongoDB')
    );

app.use(express.json());
app.use('/url', urlRoute);
app.get('/:shortId', async (req, res) => {
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
    });
    res.redirect(entry.redirectUrl);
});
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}); 