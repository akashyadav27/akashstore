import { useState, useEffect } from 'react';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const categories = ['All', 'Shoes', 'Clothing', 'Electronics', 'Accessories'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getProducts(search, category === 'All' ? '' : category);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">
          Welcome to AkashStore 🛒
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Discover amazing products at great prices
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex max-w-md mx-auto gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg text-black outline-none"
          />
          <button
            type="submit"
            className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 justify-center py-6 flex-wrap px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              category === cat
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-gray-700 hover:bg-yellow-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-xl">
            Loading products...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;