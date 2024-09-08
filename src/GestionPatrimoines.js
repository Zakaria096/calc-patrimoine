import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';
import { FaEdit, FaPlus, FaCalculator, FaTrash, FaTimes } from 'react-icons/fa';

function GestionPatrimoines() {
  const [dateFin, setDateFin] = useState(() => {
    const savedDateFin = localStorage.getItem('dateFin');
    return savedDateFin ? new Date(savedDateFin) : '';
  });
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/votre-endpoint`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  fetchData();

  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: Date.now(),
    possesseur: { nom: '' },
    libelle: '',
    valeur: 0,
    dateDebut: '',
    dateFin: '',
    tauxAmortissement: null,
    jour: null,
    valeurConstante: null,
    cloture: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/data`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    loadData();
  }, [backendUrl]);

  useEffect(() => {
    localStorage.setItem('dateFin', dateFin);
  }, [dateFin]);

  const handleCalculate = () => {
    if (!dateFin) {
      alert('Veuillez entrer une date de fin.');
      return;
    }

    const date = new Date(dateFin);

    const calculateValeurActuelle = (item) => {
      if (item.cloture) return 0;
      if (item.libelle === "Alternance" || item.libelle === "Survie") {
        return item.valeur + (item.valeurConstante ? item.valeurConstante * item.jour : 0);
      } else {
        return item.valeur - (item.tauxAmortissement ? item.valeur * (item.tauxAmortissement / 100) * (date.getFullYear() - new Date(item.dateDebut).getFullYear()) : 0);
      }
    };

    const updatedData = data.map(item => ({
      ...item,
      dateFin: date,
      valeurActuelle: calculateValeurActuelle(item),
    }));

    setData(updatedData);
    saveData(updatedData);
  };

  const handleShowModal = (item = null) => {
    setIsEditing(!!item);
    setCurrentItem(item || {
      id: Date.now(),
      possesseur: { nom: '' },
      libelle: '',
      valeur: 0,
      dateDebut: '',
      dateFin: '',
      tauxAmortissement: null,
      jour: null,
      valeurConstante: null,
      cloture: false,
    });
    setShowModal(true);
  };

  const handleSaveItem = () => {
    const updatedData = isEditing
      ? data.map(item => (item.id === currentItem.id ? currentItem : item))
      : [...data, { ...currentItem, id: Date.now() }];

    setData(updatedData);
    saveData(updatedData);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    saveData(updatedData);
  };

  const handleCloture = (id) => {
    const updatedData = data.map(item => item.id === id ? { ...item, cloture: true } : item);
    setData(updatedData);
    saveData(updatedData);
  };

  const saveData = async (updatedData) => {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement des données');
      }

      const data = await response.json();
      console.log('Data saved successfully:', data);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des données:', error);
    }
  };

  const totalValeurActuelle = data.reduce((total, item) => {
    return total + (item.valeurActuelle || 0);
  }, 0);

  
  return (
    <Container className="gestion-patrimoines">
      <Row className="my-4">
        <Col>
          <h1 className="text-center">Gestion des Patrimoines</h1>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="formDateFin">
            <Form.Label>Date de Fin</Form.Label>
            <Form.Control 
              type="date" 
              value={dateFin ? dateFin.toISOString().split('T')[0] : ''} 
              onChange={(e) => setDateFin(new Date(e.target.value))} 
            />
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button variant="primary" onClick={handleCalculate} className="w-100">
            <FaCalculator /> Calculer
          </Button>
        </Col>
        <Col md={6} className="text-right d-flex align-items-center justify-content-end">
          <h4 className="mb-0">Valeur Totale : {totalValeurActuelle.toLocaleString()} €</h4>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Button variant="success" onClick={() => handleShowModal()}>
            <FaPlus /> Ajouter un élément
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Possesseur</th>
                <th>Libellé</th>
                <th>Valeur</th>
                <th>Date de Début</th>
                <th>Date de Fin</th>
                <th>Taux d'Amortissement (%)</th>
                <th>Jours</th>
                <th>Valeur Constante</th>
                <th>Valeur Actuelle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.possesseur.nom}</td>
                  <td>{item.libelle}</td>
                  <td>{item.valeur.toLocaleString()} €</td>
                  <td>{item.dateDebut}</td>
                  <td>{item.dateFin && item.dateFin.toISOString().split('T')[0]}</td>
                  <td>{item.tauxAmortissement}</td>
                  <td>{item.jour}</td>
                  <td>{item.valeurConstante}</td>
                  <td>{item.valeurActuelle && item.valeurActuelle.toLocaleString()} €</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => handleShowModal(item)}>
                      <FaEdit />
                    </Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                      <FaTrash />
                    </Button>{' '}
                    <Button variant="secondary" size="sm" onClick={() => handleCloture(item.id)}>
                      <FaTimes />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Modifier l\'élément' : 'Ajouter un élément'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPossesseurNom">
              <Form.Label>Possesseur</Form.Label>
              <Form.Control 
                type="text" 
                value={currentItem.possesseur.nom} 
                onChange={(e) => setCurrentItem({ ...currentItem, possesseur: { nom: e.target.value } })} 
              />
            </Form.Group>
            <Form.Group controlId="formLibelle">
              <Form.Label>Libellé</Form.Label>
              <Form.Control 
                type="text" 
                value={currentItem.libelle} 
                onChange={(e) => setCurrentItem({ ...currentItem, libelle: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formValeur">
              <Form.Label>Valeur</Form.Label>
              <Form.Control 
                type="number" 
                value={currentItem.valeur} 
                onChange={(e) => setCurrentItem({ ...currentItem, valeur: parseFloat(e.target.value) })} 
              />
            </Form.Group>
            <Form.Group controlId="formDateDebut">
              <Form.Label>Date de Début</Form.Label>
              <Form.Control 
                type="date" 
                value={currentItem.dateDebut} 
                onChange={(e) => setCurrentItem({ ...currentItem, dateDebut: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formTauxAmortissement">
              <Form.Label>Taux d'Amortissement (%)</Form.Label>
              <Form.Control 
                type="number" 
                value={currentItem.tauxAmortissement} 
                onChange={(e) => setCurrentItem({ ...currentItem, tauxAmortissement: parseFloat(e.target.value) })} 
              />
            </Form.Group>
            <Form.Group controlId="formJour">
              <Form.Label>Jours</Form.Label>
              <Form.Control 
                type="number" 
                value={currentItem.jour} 
                onChange={(e) => setCurrentItem({ ...currentItem, jour: parseFloat(e.target.value) })} 
              />
            </Form.Group>
            <Form.Group controlId="formValeurConstante">
              <Form.Label>Valeur Constante</Form.Label>
              <Form.Control 
                type="number" 
                value={currentItem.valeurConstante} 
                onChange={(e) => setCurrentItem({ ...currentItem, valeurConstante: parseFloat(e.target.value) })} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveItem}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default GestionPatrimoines;
