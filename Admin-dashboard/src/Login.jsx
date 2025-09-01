import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa"; // Install react-icons for a spinner

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader
    try {
      const data = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });
      if (data.data.status === "success") {
        localStorage.setItem("userRole", data.data.data.user.role); // Store role
        console.log(data.data.data.user)
        localStorage.setItem("user", JSON.stringify(data.data.data.user));
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="p-8 md:p-10">
          <Link
            to="https://www.gudgk.edu.pk/"
            target="_blank"
            className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-16 h-16 rounded-xl object-cover mr-2"
              src="./find.jpeg"
              alt="logo"
            />
            Ghazi IT Department
          </Link>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                placeholder="name@company.com"
                required
                disabled={loading} // Disable input while loading
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                placeholder="••••••••"
                required
                disabled={loading} // Disable input while loading
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 dark:border-gray-600"
                  disabled={loading} // Disable checkbox while loading
                />
                Remember me
              </label>
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <button
              type="submit"
              className="w-full py-2.5 text-sm font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-700"
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" /> Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
