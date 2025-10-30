import { Link } from "react-router-dom";

interface User {
  name?: string;
  role?: string;
}

interface HeaderProps {
  user?: User | null;
  handleLogout?: () => void;
}

export default function Header({ user, handleLogout }: HeaderProps) {
  return (
    <header className="bg-amber-600 text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          💼 Partnership Cakrawala
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="hover:text-yellow-200 transition-colors"
          >
            Dashboard
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="hover:text-yellow-200 transition-colors"
            >
              Admin Panel
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/"
              className="bg-white text-amber-600 px-3 py-1 rounded text-sm font-semibold hover:bg-yellow-100 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
