import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';
import { FaEdit, FaPlus, FaCalculator, FaTrash } from 'react-icons/fa';

function GestionPatrimoines() {
  const [dateFin, setDateFin] = useState(() => {
    const savedDateFin = localStorage.getItem('dateFin');
    return savedDateFin ? new Date(savedDateFin) : '';
  });
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('patrimoineData');
    return savedData ? JSON.parse(savedData) : [
      {
        possesseur: { nom: "John Doe" },
        libelle: "MacBook Pro",
        valeur: 4000000,
        dateDebut: "2023-12-25T00:00:00.000Z",
        dateFin: null,
        tauxAmortissement: 5
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('patrimoineData', JSON.stringify(data));
    localStorage.setItem('dateFin', dateFin);
  }, [data, dateFin]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    possesseur: { nom: '' },
    libelle: '',
    valeur: 0,
    dateDebut: '',
    dateFin: '',
    tauxAmortissement: null,
    jour: null,
    valeurConstante: null,
  });

  const handleCalculate = () => {
    if (!dateFin) {
      alert('Veuillez entrer une date de fin.');
      return;
    }

    const date = new Date(dateFin);

    const calculateValeurActuelle = (item) => {
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
  };

  const handleShowModal = (item = null) => {
    setIsEditing(!!item);
    setCurrentItem(item || {
      possesseur: { nom: '' },
      libelle: '',
      valeur: 0,
      dateDebut: '',
      dateFin: '',
      tauxAmortissement: null,
      jour: null,
      valeurConstante: null,
    });
    setShowModal(true);
  };

  const handleDelete = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  const handleSaveItem = () => {
    const updatedData = data.map(item => 
      item.libelle === currentItem.libelle ? currentItem : item
    );

    if (!isEditing) {
      updatedData.push(currentItem);
    }

    setData(updatedData);
    setShowModal(false);
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
            <FaCalculator /> Calculate
          </Button>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button variant="success" onClick={() => handleShowModal()} className="w-100">
            <FaPlus /> Ajouter
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover className="table-styled">
        <thead>
          <tr>
            <th>Possesseur</th>
            <th>Libelle</th>
            <th>Valeur Initiale</th>
            <th>Date de Début</th>
            <th>Date de Fin</th>
            <th>Taux d'Amortissement</th>
            <th>Valeur Actuelle</th>
            <th>Actions</th>
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
              <td>
                <Button variant="warning" onClick={() => handleShowModal(item)}>
                  <FaEdit /> Modifier
                </Button>
                <Button variant="danger" onClick={() => handleDelete(index)}>
                  <FaTrash /> Supprimer
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="6" className="text-right"><strong>Total</strong></td>
            <td>{totalValeurActuelle.toFixed(2)}</td>
            <td></td>
          </tr>
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Modifier' : 'Ajouter'} un Élément</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNomPossesseur">
              <Form.Label>Nom du Possesseur</Form.Label>
              <Form.Control 
                type="text" 
                value={currentItem.possesseur.nom} 
                onChange={(e) => setCurrentItem({ ...currentItem, possesseur: { nom: e.target.value } })} 
                required
              />
            </Form.Group>
            <Form.Group controlId="formLibelle">
              <Form.Label>Libelle</Form.Label>
              <Form.Control 
                type="text" 
                value={currentItem.libelle} 
                onChange={(e) => setCurrentItem({ ...currentItem, libelle: e.target.value })} 
                required
              />
            </Form.Group>
            <Form.Group controlId="formValeur">
              <Form.Label>Valeur</Form.Label>
              <Form.Control 
                type="number" 
                value={currentItem.valeur} 
                onChange={(e) => setCurrentItem({ ...currentItem, valeur: parseFloat(e.target.value) })} 
                required
              />
            </Form.Group>
            <Form.Group controlId="formDateDebut">
              <Form.Label>Date de Début</Form.Label>
              <Form.Control 
                type="date" 
                value={currentItem.dateDebut ? new Date(currentItem.dateDebut).toISOString().split('T')[0] : ''} 
                onChange={(e) => setCurrentItem({ ...currentItem, dateDebut: e.target.value })} 
                required
              />
            </Form.Group>
            <Form.Group controlId="formTauxAmortissement">
              <Form.Label>Taux d'Amortissement</Form.Label>
              <Form.Control 
                type="number" 
                value={currentItem.tauxAmortissement || ''} 
                onChange={(e) => setCurrentItem({ ...currentItem, tauxAmortissement: parseFloat(e.target.value) || null })} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleSaveItem}>
            {isEditing ? 'Modifier' : 'Ajouter'}
            </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default GestionPatrimoines;
