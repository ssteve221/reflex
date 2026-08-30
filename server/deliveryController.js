const db = require('./db');
const crypto = require('crypto');

const ALLOWED_TRANSITIONS = {
  NEW: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'FAILED'],
  IN_TRANSIT: ['DELIVERED', 'FAILED'],
  DELIVERED: [],
  FAILED: [],
  CANCELLED: []
};

exports.createDelivery = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { reference_number, customer_name, customer_phone, delivery_address, item_description } = req.body;
    const retailer_id = req.user.retailer_id;
    const tracking_token = crypto.randomBytes(32).toString('hex');

    await client.query('BEGIN');

    const insertQuery = `
      INSERT INTO deliveries (reference_number, retailer_id, customer_name, customer_phone, delivery_address, item_description, tracking_token)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [
      reference_number, retailer_id, customer_name, customer_phone, delivery_address, item_description, tracking_token
    ]);
    const delivery = result.rows[0];

    await client.query(
      `INSERT INTO delivery_status_history (delivery_id, from_status, to_status, changed_by) VALUES ($1, NULL, 'NEW', $2)`,
      [delivery.id, req.user.id]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, data: delivery });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

exports.assignRider = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { id } = req.params;
    const { rider_id } = req.body;

    await client.query('BEGIN');

    const delRes = await client.query('SELECT * FROM deliveries WHERE id = $1 FOR UPDATE', [id]);
    if (delRes.rows.length === 0) return res.status(404).json({ error: 'Delivery not found' });

    const delivery = delRes.rows[0];
    if (delivery.status !== 'NEW') {
      return res.status(400).json({ error: `Cannot assign rider to delivery with status ${delivery.status}` });
    }

    const updateRes = await client.query(
      `UPDATE deliveries SET rider_id = $1, status = 'ASSIGNED', version = version + 1, updated_at = NOW()
       WHERE id = $2 AND version = $3 RETURNING *`,
      [rider_id, id, delivery.version]
    );

    if (updateRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Conflict: Delivery state changed by another action' });
    }

    await client.query(
      `INSERT INTO delivery_status_history (delivery_id, from_status, to_status, changed_by) VALUES ($1, 'NEW', 'ASSIGNED', $2)`,
      [id, req.user.id]
    );

    await client.query('COMMIT');
    res.json({ success: true, data: updateRes.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

exports.updateStatus = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { id } = req.params;
    const { to_status, version } = req.body;

    await client.query('BEGIN');

    const delRes = await client.query('SELECT * FROM deliveries WHERE id = $1 FOR UPDATE', [id]);
    if (delRes.rows.length === 0) return res.status(404).json({ error: 'Delivery not found' });

    const delivery = delRes.rows[0];

    if (!ALLOWED_TRANSITIONS[delivery.status].includes(to_status)) {
      return res.status(400).json({ error: `Invalid transition from ${delivery.status} to ${to_status}` });
    }

    const updateRes = await client.query(
      `UPDATE deliveries SET status = $1, version = version + 1, updated_at = NOW()
       WHERE id = $2 AND version = $3 RETURNING *`,
      [to_status, id, version || delivery.version]
    );

    if (updateRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Conflict: Stale update rejected' });
    }

    await client.query(
      `INSERT INTO delivery_status_history (delivery_id, from_status, to_status, changed_by) VALUES ($1, $2, $3, $4)`,
      [id, delivery.status, to_status, req.user.id]
    );

    await client.query('COMMIT');
    res.json({ success: true, data: updateRes.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

exports.trackDelivery = async (req, res) => {
  try {
    const { token } = req.params;
    const query = `
      SELECT d.reference_number, d.status, d.current_lat, d.current_lng, d.item_description, r.name as retailer_name
      FROM deliveries d
      JOIN retailers r ON d.retailer_id = r.id
      WHERE d.tracking_token = $1
    `;
    const result = await db.query(query, [token]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invalid tracking token' });

    res.json({ success: true, tracking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
