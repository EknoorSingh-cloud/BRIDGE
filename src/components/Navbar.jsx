import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

function Navbar() {
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!user) {
      setRole(null);
      return;
    }

    const unsub = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => setRole(snap.data()?.role ?? null)
    );

    return () => unsub();
  }, [user]);

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-600 text-white"
      : "text-gray-300 hover:bg-gray-700 hover:text-white";

  const roleColor =
    role === "student"
      ? "bg-blue-900 text-blue-300 border-blue-700"
      : role === "company"
      ? "bg-green-900 text-green-300 border-green-700"
      : "bg-purple-900 text-purple-300 border-purple-700";

  return (
    <motion.nav
      className="sticky top-0 z-50 backdrop-blur bg-gray-900/80 border-b border-gray-800"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-400">
          BRIDGE
        </div>

        <div className="flex items-center gap-3">
          <Link to="/" className={`px-4 py-2 rounded-full text-sm ${isActive("/")}`}>
            Home
          </Link>

          <Link to="/interview" className={`px-4 py-2 rounded-full text-sm ${isActive("/interview")}`}>
            Interview
          </Link>

          {user && (
            <>
              <Link to="/dashboard" className={`px-4 py-2 rounded-full text-sm ${isActive("/dashboard")}`}>
                Dashboard
              </Link>

              {/* 🎓 STUDENT */}
              {role === "student" && (
                <Link
                  to="/my-applications"
                  className={`px-4 py-2 rounded-full text-sm ${isActive("/my-applications")}`}
                >
                  My Applications
                </Link>
              )}

              {/* 🏢 COMPANY / ENTREPRENEUR */}
              {(role === "company" || role === "entrepreneur") && (
                <Link to="/add" className={`px-4 py-2 rounded-full text-sm ${isActive("/add")}`}>
                  + Add
                </Link>
              )}

              {role && (
                <span className={`px-3 py-1 text-xs rounded-full border ${roleColor}`}>
                  {role === "student" && "🎓 "}
                  {role === "company" && "🏢 "}
                  {role === "entrepreneur" && "🚀 "}
                  {role}
                </span>
              )}
            </>
          )}

          {loading ? (
            <span className="text-gray-400 animate-pulse">Loading…</span>
          ) : !user ? (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full bg-blue-600 text-white"
            >
              Login
            </Link>
          ) : (
            <div className="relative group">
              <button className="px-4 py-2 rounded-full bg-gray-700 text-sm">
                {user.email.split("@")[0]}
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
