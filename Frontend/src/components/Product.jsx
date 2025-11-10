import { useState, useEffect } from 'react';
import { getProducts } from '../../Services/api.js';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadProducts();
  }, [currentPage, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProducts({
        category: selectedCategory,
        page: currentPage,
        pageSize: 12
      });

      setProducts(data.items || data);

      if (data.totalPages) {
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      setError('Error al cargar los productos. Por favor intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Todos', 'Electrónica', 'Ropa', 'Hogar', 'Deportes'];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === 'Todos' ? '' : category);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-200 text-red-700 px-4 py-3 rounded-md shadow-md flex justify-between items-center">
          <span>{error}</span>
          <button onClick={loadProducts} className="text-red-700 font-semibold underline">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Nuestros Productos</h2>
        <p className="text-gray-300 max-w-xl mx-auto">
          Explora nuestra selección de productos de calidad
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${
              (category === 'Todos' && !selectedCategory) || selectedCategory === category
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-lg">
          No hay productos disponibles
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-800"
            >
              <div className="h-64 bg-gray-800 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 truncate">
                  {product.name}
                </h3>

                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-red-500">
                    ${product.price.toFixed(2)}
                  </span>

                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? 'En stock' : 'Agotado'}
                  </span>
                </div>

                {product.category && (
                  <span className="inline-block bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full mb-3 border border-gray-700">
                    {product.category}
                  </span>
                )}

                <button
                  disabled={product.stock === 0}
                  className={`w-full py-2 rounded-md font-medium transition-all duration-200 ${
                    product.stock > 0
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Agregar al carrito' : 'No disponible'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-red-500 text-white rounded-md disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-red-600"
          >
            Anterior
          </button>

          <span className="text-gray-300">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-red-500 text-white rounded-md disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-red-600"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
