const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');


// Configurer CORS pour autoriser des requêtes depuis ton frontend
const corsOptions = {
  origin: 'https://ton-frontend-deployé.com', // Remplace par l'URL de ton frontend
  methods: 'GET,POST,PUT,DELETE', // Méthodes HTTP autorisées
};

app.use(cors(corsOptions));




app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

// Endpoint to get data
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }
        res.send(JSON.parse(data));
    });
});

// Endpoint to update data
app.post('/api/data', (req, res) => {
    fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            res.status(500).send('Error writing data file');
            return;
        }
        res.send({ success: true });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
