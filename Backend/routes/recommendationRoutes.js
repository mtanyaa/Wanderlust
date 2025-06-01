const express = require('express');
const router = express.Router();
const { generateRecommendation } = require('../controllers/recommendationController');
const { generateRoute } = require('../controllers/recommendationController');
const { generatePlaces } = require('../controllers/recommendationController');
const { generateActivities } = require('../controllers/recommendationController');
const { generateModes } = require('../controllers/recommendationController');
const { generateAdvisory } = require('../controllers/recommendationController');

router.post('/queryForm', generateRecommendation);
router.post('/route',generateRoute);
router.post('/places',generatePlaces);
router.post('/activities', generateActivities);
router.post('/modes', generateModes);
router.post('/advisory', generateAdvisory);



module.exports = router;
