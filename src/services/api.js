const BASE = process.env.REACT_APP_API_URL;

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error del servidor');
  return data;
};

// Auth
export const loginRequest = (usuario, contrasena) =>
  fetch(`${BASE}/auth/login`, {
    method:  'POST',
    headers: headers(),
    body:    JSON.stringify({ usuario, contrasena }),
  }).then(handle);

export const meRequest = (token) =>
  fetch(`${BASE}/auth/me`, { headers: headers(token) }).then(handle);

// Usuarios
export const getUsuarios = (token) =>
  fetch(`${BASE}/usuarios`, { headers: headers(token) }).then(handle);

export const getUsuario = (token, id) =>
  fetch(`${BASE}/usuarios/${id}`, { headers: headers(token) }).then(handle);

export const crearUsuario = (token, data) =>
  fetch(`${BASE}/usuarios`, {
    method:  'POST',
    headers: headers(token),
    body:    JSON.stringify(data),
  }).then(handle);

export const actualizarUsuario = (token, id, data) =>
  fetch(`${BASE}/usuarios/${id}`, {
    method:  'PUT',
    headers: headers(token),
    body:    JSON.stringify(data),
  }).then(handle);

export const toggleEstadoUsuario = (token, id, estado) =>
  fetch(`${BASE}/usuarios/${id}/estado`, {
    method:  'PATCH',
    headers: headers(token),
    body:    JSON.stringify({ estado }),
  }).then(handle);

export const getCatalogos = (token) =>
  fetch(`${BASE}/usuarios/catalogos`, { headers: headers(token) }).then(handle);