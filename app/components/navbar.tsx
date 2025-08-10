import { Link, useLocation } from "react-router";
import { useState } from "react";

export function NavBar() {
  const location = useLocation();
  const [openPrediksiSubmenu, setOpenPrediksiSubmenu] = useState(true);
  const [openDataSubmenu, setOpenDataSubmenu] = useState(true);

  const linkClasses = (path: string) =>
    `block px-4 py-2 rounded hover:bg-blue-100 ${
      location.pathname === path ? "bg-blue-200 font-semibold text-blue-700" : ""
    }`;

  return (
    <aside className="w-64 h-screen bg-gray-100 shadow-md p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Rehab Visualizer</h1>

      <nav className="space-y-2 text-gray-700 font-medium">
        <Link to="/" className={linkClasses("/")}>Beranda</Link>

        {/* 📈 Prediksi with submenu */}
        <div>
          <button
            onClick={() => setOpenPrediksiSubmenu(!openPrediksiSubmenu)}
            className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded flex items-center justify-between"
          >
            <span>Prediksi</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                openPrediksiSubmenu ? "rotate-90" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          {openPrediksiSubmenu && (
            <div className="ml-4 space-y-1">
              <Link to="/predictions" className={linkClasses("/predictions")}>
                Umum
              </Link>
              <Link to="/predictions/heatmap" className={linkClasses("/predictions/heatmap")}>
                Heatmap
              </Link>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => setOpenDataSubmenu(!openDataSubmenu)}
            className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded flex items-center justify-between"
          >
            <span>Data TAT</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                openDataSubmenu ? "rotate-90" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          {openDataSubmenu && (
            <div className="ml-4 space-y-1">
              <Link to="data/list-data" className={linkClasses("data/list-data")}>
                Umum
              </Link>
              <Link to="data/new-data" className={linkClasses("data/new-data")}>Tambah Data</Link>
            </div>
          )}
        </div>

        <Link to="/profile-importance" className={linkClasses("/profile-importance")}>Profile Importance</Link>
        <Link to="/features" className={linkClasses("/features")}>Features Importance</Link>
        <Link to="/settings" className={linkClasses("/settings")}>Pengaturan</Link>
      </nav>
    </aside>
  );
}
