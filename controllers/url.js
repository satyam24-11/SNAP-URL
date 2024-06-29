const shortid = require('shortid');
const URL = require('../models/url');

async function HandleGenertateShortUrl(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({
            message: 'Url is required'
        });
    }
    const shortId = shortid();
    await URL.create({
        shortId,
        redirectUrl: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });
    return res.render('home', {
        id: shortId,
    });
    //return res.json({ id: shortId });
};

async function HandleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const results = await URL.findOne({ shortid });
    return res.json({
        totalClicks: results.visitHistory.length,
        analytics: results.visitHistory,
    });
}
module.exports = {
    HandleGenertateShortUrl,
    HandleGetAnalytics,
};