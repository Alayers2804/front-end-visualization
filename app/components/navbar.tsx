import { NavLink, Link } from "react-router";


export function NavBar() {
  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-2xl font-bold text-gray-800">Rehab Visualizer</Link>
        <div className="flex gap-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600">Beranda</Link>
          <Link to="/predictions" className="text-blue-500 underline">Prediksi</Link>
          <Link to="/add-data" className="text-blue-500 underline">Tambah Data</Link>
          <Link to="/profile-importance" className="text-blue-500 underline">Profile Importance</Link>
          <Link to="/features" className="text-blue-500 underline">Features Importance</Link>
        </div>
      </div>
    </nav>
  );
}
