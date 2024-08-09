import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import Possession from './Possession';
import Flux from './Flux';

function GestionPatrimoines() {
  const [dateFin, setDateFin] = useState('');
  const [data, setData] = useState([
    {
      "possesseur": { "nom": "John Doe" },
      "libelle": "MacBook Pro",
      "valeur": 4000000,
      "dateDebut": "2023-12-25T00:00:00.000Z",
      "dateFin": null,
      "tauxAmortissement": 5
    },
    {
      "possesseur": { "nom": "John Doe" },
      "libelle": "Alternance",
      "valeur": 0,
      "dateDebut": "2022-12-31T21:00:00.000Z",
      "dateFin": null,
      "tauxAmortissement": null,
      "jour": 1,
      "valeurConstante": 500000
    },
    {
      "possesseur": { "nom": "John Doe" },
      "libelle": "Survie",
      "valeur": 0,
      "dateDebut": "2022-12-31T21:00:00.000Z",
      "dateFin": null,
      "tauxAmortissement": null,
      "jour": 2,
      "valeurConstante": -300000
    },
    {
      "possesseur": { "nom": "John Doe" },
      "libelle": "MacBook Pro",
      "valeur": 4000000,
      "dateDebut": "2023-12-25T00:00:00.000Z",
      "dateFin": null,
      "tauxAmortissement": 5
    },
    {
      "possesseur": { "nom": "John Doe" },
      "libelle": "Alternance",
      "valeur": 0,
      "dateDebut": "2022-12-31T21:00:00.000Z",
      "dateFin": null,
      "tauxAmortissement": null,
      "jour": 1,
      "valeurConstante": 500000
    },
    {
      "possesseur": { "nom": "John Doe" },
      "libelle": "Survie",
      "valeur": 0,
      "dateDebut": "2022-12-31T21:00:00.000Z",
      "dateFin": null,
      "tauxAmortissement": null,
      "jour": 2,
      "valeurConstante": -300000
    }
  ]);

  const handleCalculate = () => {
    if (!dateFin) {
      alert('Veuillez entrer une date de fin.');
      return;
    }

    const date = new Date(dateFin);

    const updatedData = data.map(item => {
      if (item.libelle === "Alternance" || item.libelle === "Survie") {
        return {
          ...item,
          dateFin: date,
          valeurActuelle: item.valeur + (item.valeurConstante ? item.valeurConstante * item.jour : 0),
        };
      } else {
        return {
          ...item,
          dateFin: date,
          valeurActuelle: item.valeur - (item.tauxAmortissement ? item.valeur * (item.tauxAmortissement / 100) * (date.getFullYear() - new Date(item.dateDebut).getFullYear()) : 0),
        };
      }
    });

    setData(updatedData);
  };

  // Calculer le total des valeurs actuelles
  const totalValeurActuelle = data.reduce((total, item) => {
    if (item.valeurActuelle) {
      return total + item.valeurActuelle;
    }
    return total;
  }, 0);

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h1>Gestion des patrimoines</h1>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="formDateFin">
            <Form.Label>Date de Fin</Form.Label>
            <Form.Control 
              type="date" 
              value={dateFin} 
              onChange={(e) => setDateFin(e.target.value)} 
            />
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button variant="primary" onClick={handleCalculate}>
            Calculate
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Possesseur</th>
            <th>Labelle</th>
            <th>Valeur Initiale</th>
            <th>Date de Début</th>
            <th>Date de Fin</th>
            <th>Taux d'Amortissement</th>
            <th>Valeur Actuelle</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.possesseur.nom}</td>
              <td>{item.libelle}</td>
              <td>{item.valeur}</td>
              <td>{item.dateDebut ? new Date(item.dateDebut).toISOString().split('T')[0] : 'N/A'}</td>
              <td>{item.dateFin ? new Date(item.dateFin).toISOString().split('T')[0] : 'N/A'}</td>
              <td>{item.tauxAmortissement ? item.tauxAmortissement + '%' : 'N/A'}</td>
              <td>{item.valeurActuelle !== undefined ? item.valeurActuelle.toFixed(2) : 'N/A'}</td>
            </tr>
          ))}
          {/* Ligne pour afficher le total */}
          <tr>
            <td colSpan="6" className="text-right"><strong>Total</strong></td>
            <td>{totalValeurActuelle.toFixed(2)}</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}

export default GestionPatrimoines;
