const pool = require('../db/pool');
const { validateCreate, validateUpdate, STATUSES } = require('../utils/validation');

// GET /applications?status=&search=&page=&limit=
async function listApplications(req, res, next) {
  try {
    const { status, search, page = '1', limit = '10' } = req.query;

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status filter. Must be one of: ${STATUSES.join(', ')}.` });
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const values = [];

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (search) {
      values.push(`%${search}%`);
      const idx = values.length;
      conditions.push(`(company_name ILIKE $${idx} OR job_title ILIKE $${idx})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM applications ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count, 10);

    values.push(limitNum);
    values.push(offset);
    const dataResult = await pool.query(
      `SELECT * FROM applications ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    res.json({
      data: dataResult.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /applications/:id
async function getApplication(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    res.json({ data: result.rows[0] });
  } catch (err) {
    if (err.code === '22P02') {
      return res.status(400).json({ error: 'Invalid application id format.' });
    }
    next(err);
  }
}

// POST /applications
async function createApplication(req, res, next) {
  try {
    const errors = validateCreate(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Validation failed.', details: errors });
    }

    const { company_name, job_title, job_type, status = 'Applied', applied_date, notes = null } = req.body;

    const result = await pool.query(
      `INSERT INTO applications (company_name, job_title, job_type, status, applied_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [company_name.trim(), job_title.trim(), job_type, status, applied_date, notes]
    );

    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// PATCH /applications/:id
async function updateApplication(req, res, next) {
  try {
    const { id } = req.params;
    const errors = validateUpdate(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Validation failed.', details: errors });
    }

    const allowedFields = ['company_name', 'job_title', 'job_type', 'status', 'applied_date', 'notes'];
    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        values.push(field === 'company_name' || field === 'job_title' ? req.body[field].trim() : req.body[field]);
        updates.push(`${field} = $${values.length}`);
      }
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE applications SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    res.json({ data: result.rows[0] });
  } catch (err) {
    if (err.code === '22P02') {
      return res.status(400).json({ error: 'Invalid application id format.' });
    }
    next(err);
  }
}

// DELETE /applications/:id
async function deleteApplication(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM applications WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    res.status(204).send();
  } catch (err) {
    if (err.code === '22P02') {
      return res.status(400).json({ error: 'Invalid application id format.' });
    }
    next(err);
  }
}

module.exports = {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
};
