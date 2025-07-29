export default function AddData() {
  return (
    <section className="space-y-10">
      <h1 className="text-3xl font-bold text-center">➕ Halaman Tambah Data</h1>

      {/* 1. Form Placeholder */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Form Input Data Manual</h2>
        <div className="bg-gray-100 border border-gray-300 rounded-md p-6">
          <p className="text-gray-600 mb-4">[Placeholder untuk form input data rehabilitasi]</p>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama Pasien"
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="number"
              placeholder="Umur"
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              placeholder="Tempat Asal"
              className="border border-gray-300 p-2 rounded"
            />
            <select className="border border-gray-300 p-2 rounded">
              <option>Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
            {/* more fields as needed */}
          </form>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Simpan Data
          </button>
        </div>
      </div>

      {/* 2. Upload File Placeholder */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Unggah File Data (.csv)</h2>
        <div className="bg-gray-100 border border-gray-300 rounded-md p-6">
          <p className="text-gray-600 mb-4">[Placeholder untuk upload file CSV data pasien]</p>
          <input type="file" accept=".csv" className="block mb-4" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Unggah File
          </button>
        </div>
      </div>
    </section>
  );
}
