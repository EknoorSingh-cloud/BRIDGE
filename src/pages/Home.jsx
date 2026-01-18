import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { useAuth } from "../context/AuthContext.jsx";


function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* HERO SECTION */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-400">
          <Typewriter
            words={[
              "Welcome to BRIDGE  ",
              "Track Opportunities Easily",
              "Prepare for Interviews",
              "Boost Your Career"
            ]}
            loop={0}
            cursor
            cursorStyle="_"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1200}
          />
        </h1>

        <p className="text-gray-300 text-lg mt-4 max-w-3xl mx-auto">
          Your one-stop platform to track placement opportunities, prepare for interviews,
          and stay ahead in your career journey.
        </p>

        <div className="mt-8 space-x-4">

  <Link
    to="/dashboard"
    className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
  >
    Go to Dashboard
  </Link>

  <Link
    to="/add"
    className="border border-blue-500 px-6 py-3 rounded-lg hover:bg-blue-500 hover:text-white transition"
  >
    Add Opportunity
  </Link>

  {!user && (
    <Link
      to="/login"
      className="border border-blue-500 px-6 py-3 rounded-lg hover:bg-blue-500 hover:text-white transition"
    >
      Login
    </Link>
  )}

</div>

      </motion.div>

      {/* FEATURES SECTION */}
      <div className="mt-20 grid md:grid-cols-3 gap-6">

        {[
          {
            title: "Track Opportunities",
            desc: "Easily manage and browse all placement and internship opportunities in one place."
          },
          {
            title: "Interview Preparation",
            desc: "Get AI-powered interview practice and improve your confidence."
          },
          {
            title: "Organized Dashboard",
            desc: "A clean dashboard to keep everything structured and easy to access."
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-300">
              {feature.desc}
            </p>
          </motion.div>
        ))}

      </div>

      {/* CALL TO ACTION */}
      <motion.div
        className="mt-20 bg-gray-800 p-10 rounded-xl text-center border border-gray-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-blue-400">
          Ready to get started?
        </h2>

        <p className="text-gray-300 mt-2">
          Start exploring opportunities and boost your placement journey today.
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-6 bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Explore Now
        </Link>
      </motion.div>

    </div>
  );
}

export default Home;
