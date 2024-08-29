const express = require('express');
const app = express();
const PORT = 3001;
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

app.use(cors()); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let dataPoints = [];

// Load data from CSV file
const loadData = () => {
    dataPoints = [];
    fs.createReadStream(path.join(__dirname, 'data.csv'))
        .pipe(csv())
        .on('data', (row) => {
            const { lat, lng, laser_lat, laser_lon, alt, yaw, pitch,roll } = row;
            dataPoints.push({
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                laser_lat: parseFloat(laser_lat),
                laser_lon: parseFloat(laser_lon),
                alt: parseFloat(alt),
                yaw: parseFloat(yaw),
                pitch: parseFloat(pitch),
                roll: parseFloat(roll),
            });
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
};

// Initially load data from CSV
loadData();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API to fetch all data points
app.get('/api/data', (req, res) => {
    res.json(dataPoints);
});

// API to add a new data point (not directly adding to CSV, but in-memory for simplicity)
app.post('/api/data', (req, res) => {
    const { lat, lng, laser_lat, laser_lon, alt, yaw, pitch } = req.body;
    const newDataPoint = { lat, lng, laser_lat, laser_lon, alt, yaw, pitch };
    dataPoints.push(newDataPoint);

    // Optionally, write to CSV file here if you need persistence
    res.status(201).json(newDataPoint);
});

// API to update an existing data point (for simplicity, in-memory)
app.put('/api/data/:id', (req, res) => {
    const { id } = req.params;
    const { lat, lng, laser_lat, laser_lon, alt, yaw, pitch } = req.body;
    const index = dataPoints.findIndex(p => p.id === parseInt(id));

    if (index !== -1) {
        dataPoints[index] = { id: parseInt(id), lat, lng, laser_lat, laser_lon, alt, yaw, pitch };
        res.json(dataPoints[index]);
    } else {
        res.status(404).send('Data point not found');
    }
});

// API to delete a data point (again, in-memory)
app.delete('/api/data/:id', (req, res) => {
    const { id } = req.params;
    dataPoints = dataPoints.filter(p => p.id !== parseInt(id));
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
