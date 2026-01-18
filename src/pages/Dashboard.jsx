import OpportunityList from "../components/OpportunityList.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

function Dashboard() {
  const { user, loading } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setRole(snap.data()?.role ?? null);
    });

    return () => unsub();
  }, [user]);

  if (loading || !role) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          {role === "student"
            ? "Browse placement opportunities curated for you"
            : "Manage and post placement opportunities"}
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Role</p>
          <p className="text-xl font-semibold capitalize mt-1">
            {role}
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Access</p>
          <p className="text-xl font-semibold mt-1">
            {role === "student" ? "Browse Only" : "Full Access"}
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Status</p>
          <p className="text-xl font-semibold text-green-400 mt-1">
            Active
          </p>
        </div>
      </div>

      {/* OPPORTUNITIES */}
      <OpportunityList />
    </div>
  );
}

export default Dashboard;
