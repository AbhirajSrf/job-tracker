const JOB_TYPES = ['Internship', 'Full-time', 'Part-time'];
const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

function isValidDateString(value) {
  if (typeof value !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

// Validates a payload for creating an application.
// All required fields must be present and valid.
function validateCreate(body) {
  const errors = {};

  if (!body.company_name || typeof body.company_name !== 'string' || body.company_name.trim().length < 2) {
    errors.company_name = 'Company name is required and must be at least 2 characters.';
  }

  if (!body.job_title || typeof body.job_title !== 'string' || body.job_title.trim().length === 0) {
    errors.job_title = 'Job title is required.';
  }

  if (!body.job_type || !JOB_TYPES.includes(body.job_type)) {
    errors.job_type = `Job type must be one of: ${JOB_TYPES.join(', ')}.`;
  }

  if (body.status !== undefined && !STATUSES.includes(body.status)) {
    errors.status = `Status must be one of: ${STATUSES.join(', ')}.`;
  }

  if (!body.applied_date || !isValidDateString(body.applied_date)) {
    errors.applied_date = 'Applied date is required and must be a valid date (YYYY-MM-DD).';
  }

  if (body.notes !== undefined && body.notes !== null && typeof body.notes !== 'string') {
    errors.notes = 'Notes must be a string.';
  }

  return errors;
}

// Validates a payload for partially updating an application (PATCH).
// Only checks fields that are present in the body.
function validateUpdate(body) {
  const errors = {};

  if (body.company_name !== undefined) {
    if (typeof body.company_name !== 'string' || body.company_name.trim().length < 2) {
      errors.company_name = 'Company name must be at least 2 characters.';
    }
  }

  if (body.job_title !== undefined) {
    if (typeof body.job_title !== 'string' || body.job_title.trim().length === 0) {
      errors.job_title = 'Job title cannot be empty.';
    }
  }

  if (body.job_type !== undefined && !JOB_TYPES.includes(body.job_type)) {
    errors.job_type = `Job type must be one of: ${JOB_TYPES.join(', ')}.`;
  }

  if (body.status !== undefined && !STATUSES.includes(body.status)) {
    errors.status = `Status must be one of: ${STATUSES.join(', ')}.`;
  }

  if (body.applied_date !== undefined && !isValidDateString(body.applied_date)) {
    errors.applied_date = 'Applied date must be a valid date (YYYY-MM-DD).';
  }

  if (body.notes !== undefined && body.notes !== null && typeof body.notes !== 'string') {
    errors.notes = 'Notes must be a string.';
  }

  if (Object.keys(body).length === 0) {
    errors._general = 'Request body cannot be empty.';
  }

  return errors;
}

module.exports = { validateCreate, validateUpdate, JOB_TYPES, STATUSES };
