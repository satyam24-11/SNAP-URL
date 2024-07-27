const express = require('express');
const URL = require('../models/url');
const { restrictTo } = require('../middlewares/auth');
const router = express.Router();

// Route to get all URLs for admins
router.get('/admin/urls', restrictTo(['ADMIN']), async (req, res) => {
    try {
        const allurls = await URL.find({});
        return res.render('home', {
            urls: allurls,
        });
    } catch (error) {
        console.error('Error fetching URLs:', error);
        return res.status(500).send('Server error');
    }
});

router.get('/', restrictTo(['NORMAL', 'ADMIN']), async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/login');
        }
        const allurls = await URL.find({ createdBy: req.user._id });
        return res.render('home', {
            urls: allurls,
        });
    } catch (error) {
        console.error('Error fetching user URLs:', error);
        return res.status(500).send('Server error');
    }
});

// Route to render signup page
router.get('/signup', (req, res) => {
    return res.render('signup');
});

// Route to render login page
router.get('/login', (req, res) => {
    return res.render('login');
});

module.exports = router;
