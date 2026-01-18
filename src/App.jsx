import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Add from "./pages/Add.jsx";
import Interview from "./pages/Interview.jsx";
import Signup from "./pages/Signup.jsx";
import SelectRole from "./pages/SelectRole.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import Applicants from "./pages/Applicants.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import PageTransition from "./components/PageTransition.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />

        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />

        <Route
          path="/signup"
          element={
            <PageTransition>
              <Signup />
            </PageTransition>
          }
        />

        <Route
          path="/interview"
          element={
            <PageTransition>
              <Interview />
            </PageTransition>
          }
        />

        <Route
          path="/select-role"
          element={
            <PrivateRoute>
              <SelectRole />
            </PrivateRoute>
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            </PageTransition>
          }
        />

        {/* STUDENT */}
        <Route
          path="/my-applications"
          element={
            <PageTransition>
              <PrivateRoute>
                <MyApplications />
              </PrivateRoute>
            </PageTransition>
          }
        />

        {/* ENTREPRENEUR / COMPANY */}
        <Route
          path="/add"
          element={
            <PageTransition>
              <PrivateRoute allowedRoles={["entrepreneur", "company"]}>
                <Add />
              </PrivateRoute>
            </PageTransition>
          }
        />

        <Route
          path="/applicants/:oppId"
          element={
            <PageTransition>
              <PrivateRoute allowedRoles={["entrepreneur", "company"]}>
                <Applicants />
              </PrivateRoute>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-900 min-h-screen text-white flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <AnimatedRoutes />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
