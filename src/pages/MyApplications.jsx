import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function MyApplications() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) return;

    const fetchApps = async () => {
      const q = query(
        collection(db, "applications"),
        where("studentUid", "==", user.uid)
      );

      const snap = await getDocs(q);
      setApps(
        snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }))
      );
    };

    fetchApps();
  }, [user]);

  //  WITHDRAW APPLICATION
  const withdrawApplication = async (id) => {
    await deleteDoc(doc(db, "applications", id));
    setApps(prev => prev.filter(a => a.id !== id));
  };

  //  STATUS ICON + COLOR
  const statusUI = (status) => {
    if (status === "shortlisted") {
      return (
        <span className="text-green-400 flex items-center gap-1">
          ✅ Shortlisted
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="text-red-400 flex items-center gap-1">
          ❌ Rejected
        </span>
      );
    }
    return (
      <span className="text-yellow-400 flex items-center gap-1">
        ⏳ Applied
      </span>
    );
  };

  const filteredApps =
    filter === "all"
      ? apps
      : apps.filter(a => a.status === filter);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
          My Applications
        </h2>

        {/*  FILTER */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredApps.length === 0 && (
        <p className="text-gray-400">
          No applications found.
        </p>
      )}

      {filteredApps.map((a) => (
        <>
          {/* using document id as key */}
          <div
            key={a.id}
            className="bg-gray-800 p-5 rounded mb-4 border border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl text-blue-400">
                  {a.title}
                </h3>
                <p className="text-gray-400">
                  {a.company}
                </p>
              </div>

              {/* STATUS ICON */}
              {statusUI(a.status)}
            </div>

            {a.resumeUrl && (
              <a
                href={a.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 text-sm underline mt-2 inline-block"
              >
                View Resume
              </a>
            )}

            {/*  WITHDRAW (ONLY IF APPLIED) */}
            {a.status === "applied" && (
              <button
                onClick={() => withdrawApplication(a.id)}
                className="mt-4 px-4 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition"
              >
                Withdraw Application
              </button>
            )}
          </div>
        </>
      ))}
    </div>
  );
}

export default MyApplications;
