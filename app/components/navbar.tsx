import { Link, useLocation } from "react-router";

export function NavBar() {
  const location = useLocation();

  const linkClasses = (path: string) =>
    `block px-4 py-2 rounded hover:bg-blue-100 ${
      location.pathname === path ? "bg-blue-200 font-semibold text-blue-700" : ""
    }`;

  return (
    <aside className="w-64 h-screen bg-gray-100 shadow-md p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Rehab Visualizer</h1>

      <nav className="space-y-2 text-gray-700 font-medium">
        <Link to="/" className={linkClasses("/")}>🏠 Beranda</Link>
        <Link to="/predictions" className={linkClasses("/predictions")}>📈 Prediksi</Link>
        <Link to="/add-data" className={linkClasses("/add-data")}>➕ Tambah Data</Link>
        <Link to="/profile-importance" className={linkClasses("/profile-importance")}>📊 Profile Importance</Link>
        <Link to="/features" className={linkClasses("/features")}>🧬 Features Importance</Link>
        <Link to="/settings" className={linkClasses("/settings")}>⚙️ Pengaturan</Link>
      </nav>
    </aside>
  );
}
