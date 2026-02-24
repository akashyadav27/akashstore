import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../utils/api';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  if (loading) return <div className="text-center py-20 text-xl">Loading...</div>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Info */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-4">{product.category}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="text-3xl font-bold text-gray-900 mb-4">
              ${product.price}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400">⭐</span>
              <span>{product.rating} ({product.numReviews} reviews)</span>
            </div>

            <div className="mb-4">
              <span className={product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                {product.stock > 0 ? `✅ In Stock (${product.stock})` : '❌ Out of Stock'}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <label className="font-semibold">Qty:</label>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="border rounded-lg px-3 py-1"
                >
                  {[...Array(Math.min(product.stock, 5)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full mt-3 border border-gray-300 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;