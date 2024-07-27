const express = require('express');
const { HandleGenertateShortUrl, HandleGetAnalytics } = require('../controllers/url');
const router = express.Router();

router.post('/', HandleGenertateShortUrl);

router.get('/analytics/:shortId', HandleGetAnalytics);
module.exports = router;