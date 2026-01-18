import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { motion } from "framer-motion";

function Applicants({ opportunityId }) {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      const q = query(
        collection(db, "applications"),
        where("opportunityId", "==", opportunityId)
      );
      const snap = await getDocs(q);
      setApps(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    fetchApps();
  }, [opportunityId]);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "applications", id), { status });

    // update UI instantly
    setApps((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status } : a
      )
    );
  };

  const statusBadge = (status) => {
    if (status === "shortlisted")
      return "bg-green-600/20 text-green-400";
    if (status === "rejected")
      return "bg-red-600/20 text-red-400";
    return "bg-yellow-600/20 text-yellow-400";
  };

  return (
    <div className="space-y-4 mt-6">
      {apps.length === 0 && (
        <p className="text-gray-400">No applicants yet</p>
      )}

      {apps.map((app) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-5 rounded-xl border border-gray-700"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white font-medium">
                {app.studentEmail}
              </p>

              <a
                href={app.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 text-sm underline"
              >
                View Resume
              </a>
            </div>

            <span
              className={`px-3 py-1 text-xs rounded-full ${statusBadge(
                app.status
              )}`}
            >
              {app.status}
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() =>
                updateStatus(app.id, "shortlisted")
              }
              disabled={app.status === "shortlisted"}
              className={`px-4 py-2 rounded text-sm transition ${
                app.status === "shortlisted"
                  ? "bg-green-700 text-white"
                  : "bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white"
              }`}
            >
              ✅ Shortlist
            </button>

            <button
              onClick={() =>
                updateStatus(app.id, "rejected")
              }
              disabled={app.status === "rejected"}
              className={`px-4 py-2 rounded text-sm transition ${
                app.status === "rejected"
                  ? "bg-red-700 text-white"
                  : "bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white"
              }`}
            >
              ❌ Reject
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default Applicants;
