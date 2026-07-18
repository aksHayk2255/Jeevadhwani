const API_BASE = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "lifelink_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
}

export function registerUser(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return request("/auth/me");
}

export function getNearestDonor(bloodType) {
  return request(`/donors/nearest?bloodType=${encodeURIComponent(bloodType)}`);
}

export function createBloodRequest({ donorId, bloodType, requesterName, message }) {
  return request("/requests", {
    method: "POST",
    body: JSON.stringify({ donorId, bloodType, requesterName, message }),
  });
}

export function sendEmergencyBroadcast({ bloodType, radiusKm, message }) {
  return request("/emergency/broadcast", {
    method: "POST",
    body: JSON.stringify({ bloodType, radiusKm, message }),
  });
}
