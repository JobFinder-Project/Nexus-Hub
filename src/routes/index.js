const express = require('express');
const router = express.Router();

// const authRoutes = require('./auth.routes');
// router.use('/auth', authRoutes);

router.get('/', (req, res) => {
    res.render('home', { title: 'Nexus Hub - Home' });
});

module.exports = router;