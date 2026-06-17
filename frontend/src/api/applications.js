const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.error || 'Something went wrong.', response.status, data.details);
  }

  return data;
}

export function listApplications({ status, search, page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  params.set('page', page);
  params.set('limit', limit);
  return request(`/applications?${params.toString()}`);
}

export function getApplication(id) {
  return request(`/applications/${id}`);
}

export function createApplication(payload) {
  return request('/applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateApplication(id, payload) {
  return request(`/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteApplication(id) {
  return request(`/applications/${id}`, {
    method: 'DELETE',
  });
}

export { ApiError };
