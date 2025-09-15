import Layout from "@/components/Layout";
import {useSession, signOut} from "next-auth/react";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Home() {
  const {data: session, status} = useSession();
  const [stats,setStats] = useState(null);
  useEffect(() => {
    axios.get('/api/stats').then(r => setStats(r.data));
  }, []);
  
  if (status === "loading") {
    return <Layout>
      <div className="text-center">
        <h2>Зареждане...</h2>
      </div>
    </Layout>
  }
  
  return <Layout>
    <div className="text-blue-900 flex justify-between">
      <h2>
        Здравей, <b>{session?.user?.name}</b>
      </h2>
      <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6"/>
        <span className="px-2">
          {session?.user?.name}
        </span>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-gray-500 text-sm">Днес</div>
        <div className="text-3xl font-bold">{stats?.orders.today ?? '-'}</div>
        <div className="text-xs text-gray-400 mt-1">поръчки днес</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-gray-500 text-sm">Тази седмица</div>
        <div className="text-3xl font-bold">{stats?.orders.week ?? '-'}</div>
        <div className="text-xs text-gray-400 mt-1">поръчки тази седмица</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-gray-500 text-sm">Този месец</div>
        <div className="text-3xl font-bold">{stats?.orders.month ?? '-'}</div>
        <div className="text-xs text-gray-400 mt-1">поръчки този месец</div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-gray-500 text-sm">Приходи днес</div>
        <div className="text-3xl font-bold">{stats ? `лв ${stats.revenue.today.toLocaleString()}` : '-'}</div>
        <div className="text-xs text-gray-400 mt-1">{stats?.orders.today ?? 0} поръчки</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-gray-500 text-sm">Приходи тази седмица</div>
        <div className="text-3xl font-bold">{stats ? `лв ${stats.revenue.week.toLocaleString()}` : '-'}</div>
        <div className="text-xs text-gray-400 mt-1">{stats?.orders.week ?? 0} поръчки</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-gray-500 text-sm">Приходи този месец</div>
        <div className="text-3xl font-bold">{stats ? `лв ${stats.revenue.month.toLocaleString()}` : '-'}</div>
        <div className="text-xs text-gray-400 mt-1">{stats?.orders.month ?? 0} поръчки</div>
      </div>
    </div>
    <div className="mt-6 p-4 bg-gray-100 rounded">
      <p><strong>Имейл:</strong> {session?.user?.email}</p>
      <button onClick={() => signOut()} className="btn-red mt-2">Изход</button>
    </div>
  </Layout>
}
