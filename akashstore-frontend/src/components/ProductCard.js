import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
      {/* Image */}
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover hover:scale-105 transition duration-300"
        />
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 text-lg hover:text-yellow-500 transition">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-500 text-sm mt-1">{product.category}</p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-xl font-bold text-gray-900">
            ${product.price}
          </span>
          <span className="text-sm text-gray-400">
            ⭐ {product.rating} ({product.numReviews})
          </span>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="w-full mt-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;