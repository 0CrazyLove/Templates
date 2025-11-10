// Configuración base del API
const API_URL = 'http://localhost:5097/api';

// Helper para manejar respuestas del API
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error en la petición');
  }
  return response.json();
}

// ===== PRODUCTOS =====

/**
 * Obtener todos los productos con paginación y filtros
 * @param {Object} params - Parámetros de consulta
 * @param {string} params.category - Categoría opcional
 * @param {number} params.page - Número de página (default: 1)
 * @param {number} params.pageSize - Tamaño de página (default: 10)
 */
export async function getProducts({ category = '', page = 1, pageSize = 10 } = {}) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (category) {
      params.append('category', category);
    }

    const response = await fetch(`${API_URL}/products?${params}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
}

/**
 * Obtener un producto por ID
 * @param {number} id - ID del producto
 */
export async function getProductById(id) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al obtener producto ${id}:`, error);
    throw error;
  }
}

/**
 * Crear un nuevo producto (requiere autenticación de Admin)
 * @param {Object} productData - Datos del producto
 * @param {string} token - Token JWT de autenticación
 */
export async function createProduct(productData, token) {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
}

/**
 * Actualizar un producto (requiere autenticación de Admin)
 * @param {number} id - ID del producto
 * @param {Object} productData - Datos actualizados
 * @param {string} token - Token JWT de autenticación
 */
export async function updateProduct(id, productData, token) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    
    if (response.status === 204) {
      return { success: true };
    }
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al actualizar producto ${id}:`, error);
    throw error;
  }
}

/**
 * Eliminar un producto (requiere autenticación de Admin)
 * @param {number} id - ID del producto
 * @param {string} token - Token JWT de autenticación
 */
export async function deleteProduct(id, token) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
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
    console.error(`Error al eliminar producto ${id}:`, error);
    throw error;
  }
}