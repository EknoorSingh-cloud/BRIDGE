import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function ResumeUpload({ user, onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !user) return;

    try {
      setUploading(true);

      const fileRef = ref(
        storage,
        `resumes/${user.uid}/${Date.now()}_${file.name}`
      );

      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      setUploading(false);
      setFile(null);
      onUploaded(downloadURL);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Resume upload failed");
      setUploading(false);
    }
  };

  return (
    <div className="mt-4 p-4 rounded-xl border border-gray-700 bg-gray-900">
      <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-gray-600 cursor-pointer hover:border-green-500 hover:bg-gray-800 transition">
        📄 <span className="text-sm">Choose PDF Resume</span>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>

      {file && (
        <p className="mt-2 text-xs text-gray-400 truncate">
          Selected: {file.name}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition ${
          uploading
            ? "bg-green-700 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {uploading ? "Uploading…" : "Upload & Apply"}
      </button>
    </div>
  );
}

export default ResumeUpload;
