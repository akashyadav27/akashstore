import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, removeFromCart, totalPrice, totalItems } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!userInfo) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🛒 Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/')}
              className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="md:flex gap-6">
            {/* Cart Items */}
            <div className="md:w-2/3 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.category}</p>
                    <p className="text-yellow-500 font-bold">${item.price} x {item.qty}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="md:w-1/3 mt-6 md:mt-0">
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2">
                  <span>Items ({totalItems})</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between mb-4 font-bold text-lg border-t pt-3">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;