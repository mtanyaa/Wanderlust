const express = require('express');
const path = require('path');
const axios = require('axios');
const recommendationRoutes = require('./routes/recommendationRoutes');
const userRoute = require('./routes/userRoute');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// View engine for EJS responses
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});
app.use('/', userRoute);            // GET
app.use('/', recommendationRoutes); // POST 


app.get('/api/places', async (req, res) => {
    const { lat, lon, type } = req.query;

    if (!lat || !lon || !type) {
        return res.status(400).json({ error: 'Missing lat, lon, or type parameters' });
    }

    const url = `https://api.geoapify.com/v2/places?categories=${type}&filter=circle:${lon},${lat},5000&limit=20&apiKey=5c0e582071b54b9e9afabf6984fc23e5`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Geoapify API error:", error.message);
        res.status(500).json({ error: 'Failed to fetch data from Geoapify' });
    }
});

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
