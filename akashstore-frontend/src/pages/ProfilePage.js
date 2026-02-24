import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Info */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">👤 My Profile</h1>
          <p className="text-gray-600">Name: <strong>{userInfo?.name}</strong></p>
          <p className="text-gray-600">Email: <strong>{userInfo?.email}</strong></p>
          <p className="text-gray-600">Role: <strong>{userInfo?.isAdmin ? '⚙️ Admin' : '🛒 Customer'}</strong></p>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📦 My Orders</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">You have no orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${order.totalPrice}</p>
                    <span className={`text-sm font-semibold ${order.isPaid ? 'text-green-500' : 'text-red-500'}`}>
                      {order.isPaid ? '✅ Paid' : '❌ Not Paid'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;