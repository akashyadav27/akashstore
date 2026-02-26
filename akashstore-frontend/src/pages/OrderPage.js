import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { getOrderById } from '../utils/api';
import StripePayment from '../components/StripePayment';

// Put your Stripe publishable key here
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await getOrderById(id);
        setOrder(data);

        // If not paid, create payment intent
        if (!data.isPaid) {
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          const { data: paymentData } = await axios.post(
            `${process.env.REACT_APP_API_URL}/stripe/create-payment-intent`,
            { orderId: id },
            {
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          setClientSecret(paymentData.clientSecret);
        }
      } catch (err) {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

   fetchOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePaymentSuccess = async () => {
    setPaymentSuccess(true);
    // Refresh order data
    const { data } = await getOrderById(id);
    setOrder(data);
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading order...</div>;
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Order #{order.id}
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left — Order Details */}
          <div className="space-y-4">
            {/* Shipping */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold mb-3">📦 Shipping</h2>
              <p className="text-gray-600">
                {order.shippingAddress.street}, {order.shippingAddress.city}
              </p>
              <p className="text-gray-600">
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              <div className="mt-2">
                {order.isDelivered ? (
                  <span className="text-green-500 font-semibold">✅ Delivered</span>
                ) : (
                  <span className="text-red-500 font-semibold">❌ Not Delivered</span>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold mb-3">🛒 Items</h2>
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-gray-700">
                    {item.name} x{item.qty}
                  </span>
                  <span className="font-semibold">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg mt-3 pt-2 border-t">
                <span>Total</span>
                <span>${order.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Right — Payment */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">💳 Payment</h2>

            {order.isPaid || paymentSuccess ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-500 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-500 mb-6">
                  Your order has been placed successfully.
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg transition"
                >
                  View My Orders
                </button>
              </div>
            ) : clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: { theme: 'stripe' },
                }}
              >
                <StripePayment
                  orderId={order.id}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            ) : (
              <p className="text-gray-500">Loading payment...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;