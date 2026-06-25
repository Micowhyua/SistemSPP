"use client";

export default function Home() {
  const schoolName = "SMK Taruna Bhakti";

  const fitur = [
    {
      title: "Pembayaran Online",
      desc: "Siswa dapat membayar SPP kapan saja melalui sistem online yang aman.",
    },
    {
      title: "Status Pembayaran Transparan",
      desc: "Semua pembayaran ditampilkan dengan status terbaru: menunggu, diproses, atau selesai.",
    },
    {
      title: "Riwayat Pembayaran",
      desc: "Semua transaksi tersimpan rapi dan dapat dilihat kapan saja.",
    },
    {
      title: "Laporan Real-time",
      desc: "Pihak sekolah dapat memantau pembayaran tanpa ribet.",
    },
  ];

  const steps = [
    { num: "1", text: "Login ke akun siswa atau orang tua melalui portal SPP." },
    { num: "2", text: "Lihat tagihan SPP yang dibuat oleh petugas setiap bulan." },
    { num: "3", text: "Lakukan pembayaran melalui transfer ." },
    { num: "4", text: "Pembayaran langsung tercatat dan diverifikasi sistem." },
  ];

  return (
    <>
      {/* NAV */}
    {/* NAV */}
<nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
  <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
    
    {/* Logo + Nama Sekolah */}
    <div className="flex items-center gap-3">
      <img
        src="https://tse3.mm.bing.net/th/id/OIP.8WX6esV1osSC69Y5dTNAdwHaGQ?pid=Api&P=0&h=220"            // ganti dengan path logo kamu
        alt="Logo SMK Taruna Bhakti"
        className="w-12 h-12 object-contain"
      />
      <h1 className="text-2xl font-bold text-[#1A3D64]">
        {schoolName}
      </h1>
    </div>

    {/* Tombol Login */}
    <a
      href="/login"
      className="px-6 py-3 bg-[#1A3D64] text-white rounded-xl hover:bg-[#6D94C5] transition font-semibold"
    >
      Login
    </a>
  </div>
</nav>

      {/* HERO */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-[#1A3D64] to-[#6D94C5] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold">
            Sistem Pembayaran SPP Online
          </h2>
          <p className="mt-6 text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Membantu siswa, orang tua, dan sekolah melakukan pembayaran SPP dengan lebih mudah,
            cepat, aman, dan transparan.
          </p>

          <div className="mt-10">
            <a
              href="/login"
              className="px-10 py-5 bg-yellow-400 text-[#1A1A1D] font-bold text-xl rounded-xl hover:bg-yellow-300 transition shadow-xl"
            >
              Masuk Dashboard SPP →
            </a>
          </div>
        </div>
      </section>

      {/* FITUR UTAMA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-[#1A1A1D] mb-16">Fitur Utama</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {fitur.map((f, i) => (
              <div
                key={i}
                className="p-8 bg-gray-50 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <div className="text-4xl text-[#6D94C5] font-bold mb-4">✓</div>
                <h4 className="text-xl font-semibold mb-3">{f.title}</h4>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUSI PEMBAYARAN SPP */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl text-center font-bold mb-16 text-[#1A1A1D]">
            Solusi Pembayaran SPP Sekolah
          </h3>

          <p className="text-center text-gray-700 max-w-3xl mx-auto mb-14 text-lg">
            Mempermudah proses pembayaran SPP dengan alur yang sederhana, cepat, dan langsung
            terhubung dengan sistem administrasi sekolah.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition"
              >
                <div className="text-5xl font-extrabold text-[#6D94C5]">{step.num}</div>
                <p className="mt-4 text-gray-700 text-lg">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM TERPERCAYA */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold mb-10 text-[#1A1A1D]">
            Platform Pembayaran SPP Terpercaya
          </h3>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Sistem ini dirancang dengan standar keamanan modern, pencatatan otomatis, serta
            verifikasi yang akurat untuk memastikan setiap transaksi berjalan aman, cepat,
            dan transparan bagi seluruh pengguna.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-[#1A3D64] to-[#6D94C5] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ayo Mulai Gunakan Pembayaran SPP Online!
          </h3>
          <p className="text-xl opacity-90 mb-10">
            Cukup login, lihat tagihan, lalu bayar. Semudah itu.
          </p>
          <a
            href="/login"
            className="px-12 py-6 bg-yellow-400 text-[#1A1A1D] text-xl font-bold rounded-xl hover:bg-yellow-300 transition shadow-2xl"
          >
            Akses Dashboard →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1D] text-white py-12 text-center">
        <h4 className="text-2xl font-bold">{schoolName}</h4>
        <p className="text-gray-400 mt-2">© 2025 Sistem Pembayaran SPP Online</p>
      </footer>
    </>
  );
}
