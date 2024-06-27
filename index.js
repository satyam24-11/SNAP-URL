const express = require('express');
const { connectToMongoDb } = require('./connect');
const path = require('path');
const urlRoute = require('./routes/url');

const staticRoute = require('./routes/staticRouter');
const URL = require('./models/url');

const app = express();
const port = 3001;


connectToMongoDb('mongodb://localhost:27017/url-shortener')
    .then(() =>
        console.log('Connected to MongoDB')
    );

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.json());
//to process form data
app.use(express.urlencoded({ extended: false }));

// app.get('/test', async (req, res) => {
//     const allUrls = await URL.find({});
//     return res.render('home', {
//         urls: allUrls,
//     });
// });
app.use('/url', urlRoute);
app.use('/', staticRoute);
app.get('/url/:shortId', async (req, res) => {
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