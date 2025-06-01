const { getRecommendation } = require('../services/openaiService');
const express = require('express');
const axios = require('axios');
const router = express.Router();


const generateRecommendation = async (req, res) => {
  try {
    const { people, budget, days, season, activities, location } = req.body;

    if (!budget || !people || !days) {
      return res.status(400).send("Budget, people and days are required.");
    }

    const prompt = `You are a travel planner. Suggest at least 2 travel destinations and provide a structured itinerary for ${people} people with a budget of ₹${budget} for ${days} days during the ${season} season. Include activities such as ${activities || 'sightseeing and local experiences'}. Starting location is ${location}. Present the output in bullet points.`;

    const itinerary = await getRecommendation(prompt);

    res.render("response", { itinerary }); 
  } catch (error) {
    console.error('Error generating recommendation:', error.message);
    res.status(500).send('Something went wrong while generating recommendations.');
  }
};

const generateRoute = async (req, res) => {
  try {
    const { start, end } = req.body;

    const prompt = `You are a travel planner. Create a route place from ${start} to ${end} via various modes.`;

    const route = await getRecommendation(prompt);

    res.render("routePlanner", { route });
  } catch (error) {
    console.error('Error generating route:', error.message);
    res.status(500).send('Something went wrong while generating the route.');
  }
};


const generatePlaces = async (req, res) => {
  try {
    const { city, type } = req.body;

    if (!city || !type) {
      return res.status(400).send("City and type are required.");
    }
    const geoResponse = await axios.get(`https://api.geoapify.com/v1/geocode/search`, {
      params: {
        text: city,
        apiKey: '5c0e582071b54b9e9afabf6984fc23e5'
      }
    });

    const features = geoResponse.data.features;
    if (!features.length) {
      return res.status(404).send("City not found.");
    }

    const lat = features[0].geometry.coordinates[1];
    const lon = features[0].geometry.coordinates[0];
    const placeResponse = await axios.get(`https://api.geoapify.com/v2/places`, {
      params: {
        categories: type,
        filter: `circle:${lon},${lat},5000`,
        limit: 20,
        apiKey: '5c0e582071b54b9e9afabf6984fc23e5'
      }
    });

    const places = placeResponse.data.features;
    res.render("placesResult", {
      city,
      type,
      lat,
      lon,
      places
    });

  } catch (error) {
    console.error("Error in generatePlaces:", error.message);
    res.status(500).send("Server error while fetching places.");
  }
};


const generateActivities = async (req, res) => {
  try {
    const { city, type } = req.body;

    if (!city || !type) {
      return res.status(400).render("activities", {
        city: '',
        type: '',
        lat: null,
        lon: null,
        places: [],
        error: "City and type are required."
      });
    }

    const geoResponse = await axios.get(`https://api.geoapify.com/v1/geocode/search`, {
      params: {
        text: city,
        apiKey: '5c0e582071b54b9e9afabf6984fc23e5'
      }
    });

    const features = geoResponse.data.features;
    if (!features.length) {
      return res.status(404).render("activities", {
        city,
        type,
        lat: null,
        lon: null,
        places: [],
        error: "City not found."
      });
    }

    const lat = features[0].geometry.coordinates[1];
    const lon = features[0].geometry.coordinates[0];

    const placeResponse = await axios.get(`https://api.geoapify.com/v2/places`, {
      params: {
        categories: type,
        filter: `circle:${lon},${lat},5000`,
        limit: 20,
        apiKey: '5c0e582071b54b9e9afabf6984fc23e5'
      }
    });

    const places = placeResponse.data.features;

    res.render("activities", {
      city,
      type,
      lat,
      lon,
      places,
      error: null
    });

  } catch (error) {
    console.error("Error in generateActivities:", error.message);
    res.status(500).render("activities", {
      city: '',
      type: '',
      lat: null,
      lon: null,
      places: [],
      error: "Server error while fetching activities."
    });
  }
};

const generateModes = async (req, res) => { 
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).send("City name is required.");
    }

    const prompt = `You are a travel planner. List all available modes of transport in ${city}. Include options like Ola, Uber, local taxis, rickshaws, buses, metros, bike rentals, and any unique local options. Describe each briefly, mentioning availability and any unique features.`;

    const mode = await getRecommendation(prompt);

    res.render("modeResults", { city, mode });

  } catch (error) {
    console.error('Error generating modes:', error.message);
    res.status(500).send('Something went wrong while generating transport modes.');
  }
};

const generateAdvisory = async (req, res) => { 
  try {
    const { city } = req.body;

    if (!city || city.trim() === "") {
      return res.status(400).send("City name is required.");
    }

    const prompt = `You are a travel planner. Create a travel advisory for ${city}, including safety tips, weather considerations, best practices, and things tourists should be aware of.`;

    const advisory = await getRecommendation(prompt);

    res.render("advisoryResults", { city, advisory });

  } catch (error) {
    console.error('Error generating advisory:', error.message);
    res.status(500).send('Something went wrong while generating the travel advisory.');
  }
};



module.exports = { generateRecommendation, generateRoute, generatePlaces,generateActivities,generateModes ,generateAdvisory};


