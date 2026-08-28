// Small wrapper around fetch() so every page talks to the API the same way.
const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('crm_token');
}

function setSession(token, username) {
  localStorage.setItem('crm_token', token);
  localStorage.setItem('crm_username', username);
}

function clearSession() {
  localStorage.removeItem('crm_token');
  localStorage.removeItem('crm_username');
}

async function apiRequest(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // no JSON body
  }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return data;
}

function requireAuthOrRedirect() {
  if (!getToken()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
