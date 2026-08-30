const express = require('express');
const cors = require('cors');
require('dotenv').config();

const deliveryController = require('./deliveryController');
const { authenticateToken, authorizeRoles } = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/v1/public/track/:token', deliveryController.trackDelivery);

app.post('/api/v1/deliveries', authenticateToken, authorizeRoles('retailer_staff', 'admin'), deliveryController.createDelivery);
app.patch('/api/v1/deliveries/:id/assign', authenticateToken, authorizeRoles('dispatcher', 'admin'), deliveryController.assignRider);
app.patch('/api/v1/deliveries/:id/status', authenticateToken, authorizeRoles('rider', 'dispatcher', 'admin'), deliveryController.updateStatus);

app.get('/health', (req, res) => res.json({ status: 'OK', system: 'Reflex Backend Server' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Reflex Backend Server running on port ${PORT}`);
});
