// =============================================================================
// KostBackground — latar bagian hero halaman depan: FOTO bangunan kost asli
// (public/gambar kost.jpeg) yang perlahan zoom & bergeser (efek "Ken Burns"),
// ditutup lapisan gradient lembut ke warna base neumorphic supaya teks tetap
// jelas terbaca dan menyatu mulus dengan section di bawahnya.
// ANALOGI: seperti foto besar di dinding belakang panggung yang disorot pelan —
// murni hiasan (`aria-hidden`), tidak bisa diklik. Gerakannya lewat CSS
// (lihat .kk-photo di globals.css), tanpa JavaScript.
// =============================================================================

export function KostBackground() {
  return (
    <div className="kk-bg" aria-hidden>
      {/* Lapisan foto (di-zoom pelan). Pakai background-image agar animasi
          transform mulus & ter-crop rapi (cover). Spasi pada nama file
          di-encode jadi %20 supaya aman sebagai URL. */}
      <div
        className="kk-photo absolute inset-0 h-full w-full bg-cover"
        style={{
          backgroundImage: "url('/gambar%20kost.jpeg')",
          // fokus ke tengah-bawah foto (taman & tanaman di atrium)
          backgroundPosition: "center 64%",
        }}
      />

      {/* Overlay kiri→kanan: sisi kiri (tempat judul & tombol) ditebalkan ke
          warna base supaya teks gelap tetap kontras; sisi kanan lebih bening
          agar foto tetap terlihat di belakang kartu mockup. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(233,234,242,0.97) 0%, rgba(233,234,242,0.88) 34%, rgba(233,234,242,0.55) 64%, rgba(233,234,242,0.32) 100%)",
        }}
      />

      {/* Overlay atas→bawah: memudar ke warna base di tepi atas (di bawah nav)
          dan di tepi bawah, supaya hero menyatu tanpa garis batas. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(233,234,242,0.6) 0%, rgba(233,234,242,0) 22%, rgba(233,234,242,0) 72%, rgba(233,234,242,1) 100%)",
        }}
      />

      {/* Glow ungu lembut khas brand, mengambang pelan di pojok. */}
      <div
        className="kk-blob"
        style={{
          width: 320,
          height: 320,
          top: -60,
          left: -40,
          background: "radial-gradient(circle,#b9acff,transparent 70%)",
          animation: "kkDrift 16s ease-in-out infinite",
        }}
      />
    </div>
  );
}
