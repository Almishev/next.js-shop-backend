import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders,setOrders] = useState([]);
  const [deletingId,setDeletingId] = useState(null);
  useEffect(() => {
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
    });
  }, []);
  async function deleteOrder(id) {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази поръчка?')) return;
    setDeletingId(id);
    await axios.delete('/api/orders?id='+id);
    setOrders(prev => prev.filter(o => o._id !== id));
    setDeletingId(null);
  }
  return (
    <Layout>
      <h1>Поръчки</h1>
      <table className="basic border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-b-2 border-gray-400 py-3">Дата</th>
            <th className="border-b-2 border-gray-400 py-3">Платена</th>
            <th className="border-b-2 border-gray-400 py-3">Получател</th>
            <th className="border-b-2 border-gray-400 py-3">Продукти</th>
          </tr>
        </thead>
        <tbody>
        {orders.length > 0 && orders.map(order => (
          <tr key={order._id} className="border-b-2 border-gray-300">
            <td className="py-3">{(new Date(order.createdAt)).toLocaleString()}
            </td>
            <td className={`py-3 ${order.paid ? 'text-green-600' : 'text-orange-600'}`}>
              {order.paid ? 'ПЛАТЕНА' : 'НАЛОЖЕН ПЛАТЕЖ'}
            </td>
            <td className="py-3">
              <div className="font-semibold">{order.name}</div>
              <div className="text-sm text-gray-600">{order.email}</div>
              {order.phone && <div className="text-sm text-blue-600">📞 {order.phone}</div>}
              <div className="text-sm">
                {order.streetAddress}, {order.city} {order.postalCode}, {order.country}
              </div>
            </td>
            <td className="py-3">
              {order.line_items.map((l, index) => (
                <div key={index} className="text-sm">
                  {l.price_data?.product_data.name} x {l.quantity}
                </div>
              ))}
            </td>
            <td className="py-3 text-right whitespace-nowrap">
              <button
                onClick={() => deleteOrder(order._id)}
                disabled={deletingId === order._id}
                className={`btn-red ${deletingId === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {deletingId === order._id ? 'Изтриване...' : 'Изтрий'}
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </Layout>
  );
}
