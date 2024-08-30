import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import GestionPatrimoines from './GestionPatrimoines';
import Fluctuations from './Fluctuations';

function App() {
  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="/">Gestion Patrimoine</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">Gestion des Patrimoines</Nav.Link>
              <Nav.Link as={Link} to="/fluctuations">Fluctuations</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<GestionPatrimoines />} />
            <Route path="/fluctuations" element={<Fluctuations />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
