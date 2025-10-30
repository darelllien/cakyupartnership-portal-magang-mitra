import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/Login";

export default function App() {
  const user = localStorage.getItem("user");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}
