import { useState } from "react";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext.jsx";

function Add() {
  const { user, loading } = useAuth();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-red-400">
        You must be logged in to add opportunities
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "opportunities"), {
        title,
        company,
        description,
        createdBy: user.email,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setCompany("");
      setDescription("");

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

    } catch (err) {
      setErrorToast(true);
      setTimeout(() => setErrorToast(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10 text-white">
      <h2 className="text-3xl font-bold text-blue-400 mb-6">
        Add Opportunity
      </h2>

      {showToast && (
        <div className="fixed top-10 right-10 bg-green-600 px-6 py-3 rounded-lg shadow-lg">
          Opportunity added successfully!
        </div>
      )}

      {errorToast && (
        <div className="fixed top-10 right-10 bg-red-600 px-6 py-3 rounded-lg shadow-lg">
          Error adding opportunity
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 bg-gray-800 rounded"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="w-full p-3 bg-gray-800 rounded"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />

        <textarea
          className="w-full p-3 bg-gray-800 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Opportunity
        </button>
      </form>
    </div>
  );
}

export default Add;
