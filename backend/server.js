// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Placeholder data
let possessions = [];

// GET Possession list
app.get('/possession', (req, res) => {
  res.json(possessions);
});

// Create Possession
app.post('/possession', (req, res) => {
  const { libelle, valeur, dateDebut, taux } = req.body;
  possessions.push({ libelle, valeur, dateDebut, dateFin: null, taux });
  res.status(201).json({ message: 'Possession created', possession: req.body });
});

// Update Possession by libelle
app.put('/possession/:libelle', (req, res) => {
  const { libelle } = req.params;
  const { dateFin } = req.body;
  const possession = possessions.find(p => p.libelle === libelle);
  if (possession) {
    possession.dateFin = dateFin;
    res.json({ message: 'Possession updated', possession });
  } else {
    res.status(404).json({ message: 'Possession not found' });
  }
});

// Close Possession
app.put('/possession/:libelle/close', (req, res) => {
  const { libelle } = req.params;
  const possession = possessions.find(p => p.libelle === libelle);
  if (possession) {
    possession.dateFin = new Date();
    res.json({ message: 'Possession closed', possession });
  } else {
    res.status(404).json({ message: 'Possession not found' });
  }
});

// Get Valeur Patrimoine on a specific date
app.get('/patrimoine/:date', (req, res) => {
  const { date } = req.params;
  const patrimoineValue = calculatePatrimoineValue(new Date(date));
  res.json({ date, valeur: patrimoineValue });
});

// Get Valeur Patrimoine Range
app.post('/patrimoine/range', (req, res) => {
  const { type, dateDebut, dateFin, jour } = req.body;
  const patrimoineRange = calculatePatrimoineRange(type, dateDebut, dateFin, jour);
  res.json({ type, dateDebut, dateFin, jour, valeur: patrimoineRange });
});

// Helper functions
function calculatePatrimoineValue(date) {
  // Implement logic to calculate patrimoine value on a specific date
  return possessions.reduce((acc, p) => {
    // Sample calculation
    return acc + p.valeur;
  }, 0);
}

function calculatePatrimoineRange(type, dateDebut, dateFin, jour) {
  // Implement logic to calculate patrimoine value over a range
  return Math.random() * 10000; // Placeholder
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
