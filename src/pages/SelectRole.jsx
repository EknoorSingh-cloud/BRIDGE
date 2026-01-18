import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

function SelectRole() {
  const [saving, setSaving] = useState(false);

  const chooseRole = async (role) => {
    if (saving) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      setSaving(true);

      await updateDoc(doc(db, "users", user.uid), {
        role,
      });
    } catch (err) {
      console.error("Role save failed", err);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Who are you?</h1>

      {saving ? (
        <p className="text-blue-400 animate-pulse">
          Saving your choice…
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => chooseRole("student")}
            className="p-6 bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            🎓 Student
          </button>

          <button
            onClick={() => chooseRole("entrepreneur")}
            className="p-6 bg-green-600 rounded-xl hover:bg-green-700"
          >
            🚀 Entrepreneur
          </button>

          <button
            onClick={() => chooseRole("company")}
            className="p-6 bg-purple-600 rounded-xl hover:bg-purple-700"
          >
            🏢 Company
          </button>
        </div>
      )}
    </div>
  );
}

export default SelectRole;
