import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const Fluctuations = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const savedDateFin = localStorage.getItem('dateFin');
    return savedDateFin ? new Date(savedDateFin) : new Date();
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      generateData(startDate, endDate);
    }
  }, [startDate, endDate]);

  const generateData = (start, end) => {
    const data = [];
    const numDates = 5; // Limiter à 5 dates
    let currentDate = new Date(start);
    for (let i = 0; i < numDates; i++) {
      const randomDate = new Date(currentDate);
      randomDate.setMonth(randomDate.getMonth() + Math.floor(Math.random() * 6) + 5); // Ajoute 5 à 10 mois aléatoires
      if (randomDate > end) break;
      data.push({
        date: randomDate.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 500) + 100, // Génère une valeur aléatoire entre 100 et 600
      });
      currentDate = randomDate;
    }
    // Trier les dates
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    setData(data);
  };

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h1>Fluctuations</h1>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="formStartDate">
            <Form.Label>Date de Début</Form.Label>
            <DatePicker 
              selected={startDate} 
              onChange={(date) => setStartDate(date)} 
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="formEndDate">
            <Form.Label>Date de Fin</Form.Label>
            <DatePicker 
              selected={endDate} 
              onChange={(date) => setEndDate(date)} 
              dateFormat="yyyy-MM-dd"
              className="form-control"
              readOnly
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={data}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorUv)" 
                strokeWidth={3} 
                dot={{ r: 6, stroke: '#8884d8', strokeWidth: 2, fill: '#fff', shadow: '0 0 10px rgba(0, 0, 0, 0.5)' }} 
                activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default Fluctuations;
