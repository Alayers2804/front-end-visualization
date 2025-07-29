import { NavBar } from "~/components/navbar";
import type { Route } from "./+types/home";
import { Link } from "react-router";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center pt-16 pb-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Website Visualisasi Rehab Narkoba</h1>
        <p className="mb-6">Silakan pilih fitur:</p>
        <div className="flex flex-col gap-4">
          <Link to="/visualizations" className="text-blue-500 underline">Visualisasi Data</Link>
          <Link to="/predictions" className="text-blue-500 underline">Prediksi</Link>
          <Link to="/add-data" className="text-blue-500 underline">Tambah Data</Link>
        </div>
      </main>
    </>
  )
}
