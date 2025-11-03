import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// In-memory data
const ZONES = ['A', 'B', 'C', 'D'];
let spots = Array.from({ length: 32 }, (_, i) => {
  const zone = ZONES[Math.floor(i / 8)];
  const idNum = (i % 8) + 1;
  return {
    id: i + 1,
    spotId: `${zone}${idNum}`,
    zone: `Zone ${zone}`,
    occupied: Math.random() > 0.6,
    reserved: Math.random() > 0.85,
    evCharging: Math.random() > 0.8,
    handicap: Math.random() > 0.9,
    shaded: Math.random() > 0.7,
    ecoScore: Math.floor(Math.random() * 100),
    x: Math.floor(Math.random() * 1000),
    y: Math.floor(Math.random() * 800)
  };
});

let reservations = [];

const computeStatistics = () => ({
  total: spots.length,
  free: spots.filter(s => !s.occupied && !s.reserved).length,
  occupied: spots.filter(s => s.occupied).length,
  reserved: spots.filter(s => s.reserved).length
});

// Routes used by frontend
app.get('/api/driver/spots', (req, res) => {
  res.json(spots);
});

app.get('/api/driver/statistics', (req, res) => {
  res.json(computeStatistics());
});

app.get('/api/driver/reservations/:vehicle', (req, res) => {
  const { vehicle } = req.params;
  const found = reservations.find(r => r.vehicleNumber === vehicle);
  if (!found) return res.status(404).json({ message: 'No reservation' });
  res.json(found);
});

app.post('/api/driver/reserve', (req, res) => {
  const { spotId, vehicleNumber } = req.body || {};
  if (!spotId || !vehicleNumber) return res.status(400).json({ message: 'Missing fields' });

  const spot = spots.find(s => s.spotId === spotId);
  if (!spot || spot.occupied || spot.reserved) {
    return res.status(409).json({ message: 'Spot unavailable' });
  }

  const existing = reservations.find(r => r.vehicleNumber === vehicleNumber);
  if (existing) {
    return res.status(409).json({ message: 'Vehicle already has a reservation' });
  }

  spot.reserved = true;
  const reservation = {
    reservationId: uuidv4(),
    spotId,
    vehicleNumber,
    createdAt: Date.now(),
    expiryTime: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
  };
  reservations.push(reservation);
  return res.status(201).json(reservation);
});

app.delete('/api/driver/reservations/:reservationId', (req, res) => {
  const { reservationId } = req.params;
  const idx = reservations.findIndex(r => r.reservationId === reservationId);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });

  const reservation = reservations[idx];
  const spot = spots.find(s => s.spotId === reservation.spotId);
  if (spot) spot.reserved = false;
  reservations.splice(idx, 1);
  return res.json({ ok: true });
});

// Helper endpoints used by UI buttons
app.get('/api/driver/spots/nearest', (req, res) => {
  // naive nearest: choose first free spot
  const free = spots.filter(s => !s.occupied && !s.reserved);
  if (free.length === 0) return res.status(404).json({ message: 'No free spots' });
  res.json(free[0]);
});

app.get('/api/driver/spots/eco', (req, res) => {
  const free = spots.filter(s => !s.occupied && !s.reserved);
  if (free.length === 0) return res.status(404).json({ message: 'No eco spots' });
  const best = free.reduce((a, b) => (a.ecoScore > b.ecoScore ? a : b));
  res.json(best);
});

// Periodically update occupancy to simulate real-time changes
setInterval(() => {
  spots = spots.map(s => {
    // Small random changes to simulate flow
    const roll = Math.random();
    if (!s.reserved) {
      if (!s.occupied && roll > 0.95) s.occupied = true;
      if (s.occupied && roll < 0.05) s.occupied = false;
    }
    return s;
  });
}, 5000);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
