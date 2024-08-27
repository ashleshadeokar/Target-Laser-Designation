const express = require('express');
const app = express();
const PORT = 3001;
const cors = require('cors');
const path = require('path');

app.use(cors()); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let dataPoints = [
    { id: 1, lat: 33.450669, lng: -82.219374, alt: 10.1 },
    { id: 2, lat: 33.450313, lng: -82.219425, alt: 15.2 },
    { id: 3, lat: 33.450148, lng: -82.219434, alt: 20.1 },
    { id: 4, lat: 33.452697, lng: -82.219334, alt: 25.2 },
    { id: 5, lat: 33.452999, lng: -82.219245, alt: 30.5 },
    { id: 6, lat: 33.452191, lng: -82.219196, alt: 35.6 },
    { id: 7, lat: 33.451294, lng: -82.219138, alt: 40.3 },
    { id: 8, lat: 33.452385, lng: -82.219163, alt: 44.5 },
    { id: 9, lat: 33.452939, lng: -82.219175, alt: 50.8 },
    { id: 10, lat: 33.452116, lng: -82.219179, alt: 55.2 },
    { id: 11, lat: 33.452914, lng: -82.219125, alt: 60.7 },
    { id: 12, lat: 33.452198, lng: -82.219107, alt: 65.1 },
    { id: 13, lat: 33.452905, lng: -82.219104, alt: 70.5 },
    { id: 14, lat: 33.452353, lng: -82.219082, alt: 75.2 },
    { id: 15, lat: 33.452862, lng: -82.219018, alt: 80.5 },
    { id: 16, lat: 33.452596, lng: -82.219009, alt: 85.3 },
    { id: 17, lat: 33.452844, lng: -82.218949, alt: 90.6 },
    { id: 18, lat: 33.452403, lng: -82.218948, alt: 95.6 },
    { id: 19, lat: 33.452564, lng: -82.2189, alt: 100.9 },
    { id: 20, lat: 33.452864, lng: -82.2189, alt: 113.2 }
];

// API to fetch all data points
app.get('/api/data', (req, res) => {
    res.json(dataPoints);
});

// API to add a new data point
app.post('/api/data', (req, res) => {
    const { lat, lng, alt } = req.body;
    const newId = dataPoints.length + 1;  // Simple ID generation strategy
    const newDataPoint = { id: newId, lat, lng, alt };
    dataPoints.push(newDataPoint);
    res.status(201).json(newDataPoint);
});

// API to update an existing data point
app.put('/api/data/:id', (req, res) => {
    const { id } = req.params;
    const { lat, lng, alt } = req.body;
    const index = dataPoints.findIndex(p => p.id === parseInt(id));

    if (index !== -1) {
        dataPoints[index] = { id: parseInt(id), lat, lng, alt };
        res.json(dataPoints[index]);
    } else {
        res.status(404).send('Data point not found');
    }
});

// API to delete a data point
app.delete('/api/data/:id', (req, res) => {
    const { id } = req.params;
    dataPoints = dataPoints.filter(p => p.id !== parseInt(id));
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});