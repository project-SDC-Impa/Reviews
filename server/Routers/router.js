const express = require('express');
const router = express.Router();
const { getReviews, getMeta,  addReview, markReviewHelpful,reportReview } = require('../Controllers/index.js');

router.get('/')
router.get('/reviews/', getReviews);
router.get('/reviews/meta', getMeta);
router.post('/reviews/', addReview);
router.put('/reviews/:review_id/helpful', markReviewHelpful);
router.put('/reviews/:review_id/report', reportReview);

module.exports = router;