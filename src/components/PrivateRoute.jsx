import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

function PrivateRoute({ children, allowedRoles }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(undefined);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setRole(null);
        return;
      }

      setUser(currentUser);

      const unsubRole = onSnapshot(
        doc(db, "users", currentUser.uid),
        (snap) => {
          setRole(snap.data()?.role ?? null);
        }
      );

      return () => unsubRole();
    });

    return () => unsubAuth();
  }, []);

  //  Wait for role to load
  if (role === undefined) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  //  Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  //  Logged in but role not chosen
  if (role === null) {
    return <Navigate to="/select-role" replace />;
  }

  //  Role exists but not allowed for this route
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Allowed → SHOW THE PAGE
  return children;
}

export default PrivateRoute;
