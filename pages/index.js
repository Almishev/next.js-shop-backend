import Layout from "@/components/Layout";
import {useSession, signOut} from "next-auth/react";

export default function Home() {
  const {data: session, status} = useSession();
  
  if (status === "loading") {
    return <Layout>
      <div className="text-center">
        <h2>Loading...</h2>
      </div>
    </Layout>
  }
  
  return <Layout>
    <div className="text-blue-900 flex justify-between">
      <h2>
        Hello, <b>{session?.user?.name}</b>
      </h2>
      <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6"/>
        <span className="px-2">
          {session?.user?.name}
        </span>
      </div>
    </div>
    
    <div className="mt-4 p-4 bg-gray-100 rounded">
      <h3>Welcome to Admin Dashboard</h3>
      <p><strong>Email:</strong> {session?.user?.email}</p>
      <button 
        onClick={() => signOut()}
        className="btn-red mt-2"
      >
        Force Logout
      </button>
    </div>
  </Layout>
}
