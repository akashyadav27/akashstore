import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../utils/api';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress: address,
        paymentMethod: 'Stripe',
        totalPrice: Number(totalPrice),
      };
      const { data } = await createOrder(orderData);
      clearCart();
      navigate(`/orders/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📦 Checkout</h1>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Shipping Address</h2>

          <input
            name="street"
            placeholder="Street Address"
            value={address.street}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-yellow-400"
          />
          <input
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-yellow-400"
          />
          <input
            name="postalCode"
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-yellow-400"
          />
          <input
            name="country"
            placeholder="Country"
            value={address.country}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-yellow-400"
          />

          {/* Order Summary */}
          <div className="border-t pt-4 mt-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-600 mb-1">
                <span>{item.name} x{item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg border-t pt-3 mt-2">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : '✅ Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;