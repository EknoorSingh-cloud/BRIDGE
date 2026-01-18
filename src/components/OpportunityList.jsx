import { useEffect, useState } from "react";
import { db } from "../firebase.js";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import ResumeUpload from "./ResumeUpload";
import { useNavigate } from "react-router-dom"; 

function OpportunityList() {
  const [opportunities, setOpportunities] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  
  const [editToast, setEditToast] = useState(false);
  const [deleteToast, setDeleteToast] = useState(false);

  
  const [appliedMap, setAppliedMap] = useState({});

  const { user } = useAuth();
  const navigate = useNavigate(); 

  //  FETCH OPPORTUNITIES
  const fetchData = async () => {
    const q = query(
      collection(db, "opportunities"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    setOpportunities(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  //  FETCH STUDENT APPLICATIONS
  const fetchApplied = async () => {
    if (!user) return;

    const q = query(
      collection(db, "applications"),
      where("studentUid", "==", user.uid)
    );

    const snap = await getDocs(q);
    const map = {};
    snap.docs.forEach((doc) => {
      map[doc.data().opportunityId] = true;
    });

    setAppliedMap(map);
  };

  useEffect(() => {
    fetchData();
    fetchApplied();
  }, [user]);

  //  APPLY WITH RESUME
  const applyToOpportunity = async (opp, resumeUrl) => {
    if (!user) return;

    const q = query(
      collection(db, "applications"),
      where("opportunityId", "==", opp.id),
      where("studentUid", "==", user.uid)
    );

    const existing = await getDocs(q);
    if (!existing.empty) return;

    await addDoc(collection(db, "applications"), {
      opportunityId: opp.id,
      title: opp.title,
      company: opp.company,
      studentUid: user.uid,
      studentEmail: user.email,
      resumeUrl,
      appliedAt: serverTimestamp(),
      status: "applied",
    });

    setAppliedMap(prev => ({
      ...prev,
      [opp.id]: true,
    }));
  };

  //  DELETE
  const confirmDelete = async (id) => {
    await deleteDoc(doc(db, "opportunities", id));
    setDeleteId(null);

    setDeleteToast(true);
    setTimeout(() => setDeleteToast(false), 3000);

    fetchData();
  };

  //  EDIT
  const startEdit = (opp) => {
    setEditingId(opp.id);
    setEditData({
      title: opp.title,
      description: opp.description,
      company: opp.company,
    });
  };

  const saveEdit = async (id) => {
    await updateDoc(doc(db, "opportunities", id), editData);
    setEditingId(null);

    setEditToast(true);
    setTimeout(() => setEditToast(false), 3000);

    fetchData();
  };

  return (
    <>
      {/* TOASTS */}
      {editToast && (
        <div className="fixed top-10 right-10 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
          Updated successfully!
        </div>
      )}

      {deleteToast && (
        <div className="fixed top-20 right-10 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          Deleted successfully!
        </div>
      )}

      {/* EMPTY STATE */}
      {opportunities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800 p-10 rounded-xl text-center border border-gray-700 mt-10"
        >
          <p className="text-xl text-gray-300">
            No opportunities available yet
          </p>
          <p className="text-gray-500 mt-2">
            Be the first to add one!
          </p>
        </motion.div>
      )}

      {/* OPPORTUNITY GRID */}
      {opportunities.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {opportunities.map((opp) => {
              const isOwner = user?.email === opp.createdBy;
              const hasApplied = appliedMap[opp.id];

              return (
                <motion.div
                  key={opp.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gray-800 p-6 rounded-xl border border-gray-700"
                >
                  {editingId === opp.id ? (
                    <>
                      <input
                        className="w-full p-2 bg-gray-700 rounded mb-2"
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                      />

                      <input
                        className="w-full p-2 bg-gray-700 rounded mb-2"
                        value={editData.company}
                        onChange={(e) =>
                          setEditData({ ...editData, company: e.target.value })
                        }
                      />

                      <textarea
                        className="w-full p-2 bg-gray-700 rounded mb-2"
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                      />

                      <button
                        onClick={() => saveEdit(opp.id)}
                        className="bg-green-600 px-4 py-2 rounded mr-2"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-600 px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl text-blue-400 font-semibold">
                        {opp.title}
                      </h3>

                      <p className="text-gray-300 mt-2">
                        {opp.description}
                      </p>

                      <p className="text-sm text-gray-400 mt-3">
                        Company: {opp.company}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Posted by: {opp.createdBy}
                      </p>

                      {/*  APPLY / APPLIED */}
                      {user && !isOwner && (
                        hasApplied ? (
                          <span className="inline-block mt-4 px-4 py-2 rounded bg-green-700/20 text-green-400 text-sm">
                            ✔ Applied
                          </span>
                        ) : (
                          <ResumeUpload
                            user={user}
                            onUploaded={(url) =>
                              applyToOpportunity(opp, url)
                            }
                          />
                        )
                      )}

                      {/* OWNER ACTIONS */}
                      {isOwner && (
                        <div className="mt-4 space-x-2">
                          {deleteId === opp.id ? (
                            <>
                              <span className="text-sm text-red-400 mr-2">
                                Confirm delete?
                              </span>

                              <button
                                onClick={() => confirmDelete(opp.id)}
                                className="bg-red-700 px-3 py-1 rounded"
                              >
                                Yes
                              </button>

                              <button
                                onClick={() => setDeleteId(null)}
                                className="bg-gray-600 px-3 py-1 rounded"
                              >
                                No
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(opp)}
                                className="bg-blue-600 px-3 py-1 rounded"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => setDeleteId(opp.id)}
                                className="bg-red-600 px-3 py-1 rounded"
                              >
                                Delete
                              </button>

                              {/* NEW: VIEW APPLICANTS */}
                              <button
                                onClick={() =>
                                  navigate(`/applicants/${opp.id}`)
                                }
                                className="bg-purple-600 px-3 py-1 rounded"
                              >
                                View Applicants
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

export default OpportunityList;
