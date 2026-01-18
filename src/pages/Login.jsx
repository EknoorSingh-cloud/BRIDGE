import { useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //  Email + Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login + Firestore user creation
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 🔥 Ensure Firestore user exists
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          role: null, //  role selection will trigger
          createdAt: serverTimestamp(),
        });
      }

      navigate("/dashboard");
    } catch (err) {
      setError("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  //  Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-400 text-center">
        Login to Placement Buddy
      </h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="w-full p-2 mb-3 bg-gray-700 rounded outline-none"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full p-2 mb-3 bg-gray-700 rounded outline-none"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded w-full mt-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <button
        onClick={handleForgotPassword}
        className="text-sm text-blue-400 mt-3 block mx-auto"
      >
        Forgot password?
      </button>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-600" />
        <span className="mx-2 text-gray-400">OR</span>
        <hr className="flex-grow border-gray-600" />
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="bg-white text-black px-4 py-2 rounded w-full disabled:opacity-50"
      >
        Sign in with Google
      </button>

      <p className="text-center text-sm text-gray-400 mt-4">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-400">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;
