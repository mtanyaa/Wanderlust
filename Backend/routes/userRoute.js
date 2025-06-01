const express = require('express');
const path = require('path');
const router = express.Router();


router.get('/queryForm', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/queryForm.html'));
});

router.get('/route', (req, res) => {
   res.sendFile(path.join(__dirname, '../../frontend/route.html'));
});

router.get('/places', (req, res) => {
   res.sendFile(path.join(__dirname, '../../frontend/advisory.html'));
});

router.get('/activities', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/activities.html'));
});

router.get('/modes', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/modes.html'));

})

router.get('/advisory', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/travelAdvisory.html'));

})

module.exports = router;
