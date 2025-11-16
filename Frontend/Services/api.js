const API_URL = 'http://localhost:5097/api';

// Helper para manejar respuestas del API
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error en la petición');
  }
  return response.json();
}

// ===== SERVICIOS =====
export async function getServices({ category = '', page = 1, pageSize = 10, minPrice = null, maxPrice = null } = {}) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (category) params.append('category', category);
    if (minPrice !== null) params.append('minPrice', minPrice.toString());
    if (maxPrice !== null) params.append('maxPrice', maxPrice.toString());
    
    const response = await fetch(`${API_URL}/services?${params}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    throw error;
  }
}

export async function getServiceById(id) {
  try {
    const response = await fetch(`${API_URL}/services/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al obtener servicio ${id}:`, error);
    throw error;
  }
}

export async function getServiceCategories() {
  try {
    const response = await fetch(`${API_URL}/services/categories`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
}

export async function createService(serviceData, token) {
  try {
    const response = await fetch(`${API_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(serviceData)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al crear servicio:', error);
    throw error;
  }
}

export async function updateService(id, serviceData, token) {
  try {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(serviceData)
    });
    
    if (response.status === 204 || response.status === 200) {
      return { success: true };
    }
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al actualizar servicio ${id}:`, error);
    throw error;
  }
}

export async function deleteService(id, token) {
  try {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 204) {
      return { success: true };
    }
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al eliminar servicio ${id}:`, error);
    throw error;
  }
}

// ===== AUTENTICACIÓN =====
export async function registerUser(data) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: data.userName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al registrar:', error);
    throw error;
  }
}

export async function loginUser(data) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
}

// ===== GOOGLE AUTHENTICATION =====
/**
 * Enviar el código de autorización de Google al backend
 * @param {string} code - Código de autorización de Google
 */
export async function googleCallback(code) {
  try {
    const response = await fetch(`${API_URL}/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en Google callback:', error);
    throw error;
  }
}

// ===== DASHBOARD =====
export async function getDashboardStats(token) {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      method: 'GET',
      headers
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    throw error;
  }
}

// ===== ORDERS =====
export async function getOrders(token) {
  try {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    throw error;
  }
}

export async function getOrderById(id, token) {
  try {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'GET',
      headers
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al obtener orden ${id}:`, error);
    throw error;
  }
}

export async function createOrder(orderDto, token) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderDto)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al crear orden:', error);
    throw error;
  }
}