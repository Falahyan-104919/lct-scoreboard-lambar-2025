// src/pages/ScoreboardPage.jsx
import { useState, useEffect } from "react"; // 1. Import hook tambahan
import { useLomba } from "@/hooks/useLomba";
import { motion } from "framer-motion";
import AnimatedCounter from "@/components/shared/AnimatedCounter";

const SCORE_ANIMATION_DURATION = 0.55; // Durasi animasi skor dalam detik

export default function ScoreboardPage() {
  const { tim: timDariHook } = useLomba();

  // 2. State baru untuk menampung data tim yang akan ditampilkan di layar.
  // Ini memberi kita kontrol atas kapan urutan diperbarui.
  const [displayedTim, setDisplayedTim] = useState([]);

  // 3. Efek untuk mengorkestrasi animasi secara berurutan
  useEffect(() => {
    // Saat data dari hook berubah...

    // Langkah 1: Segera perbarui skor, tapi pertahankan urutan lama.
    // Ini akan memicu animasi counter TANPA mengubah layout.
    setDisplayedTim((prevDisplayedTim) => {
      // Jika state sebelumnya kosong (render pertama), langsung isi.
      if (prevDisplayedTim.length === 0) {
        return [...timDariHook].sort((a, b) => b.skor - a.skor);
      }

      // Jika sudah ada data, buat array baru dengan urutan yang sama persis,
      // tapi dengan nilai skor yang sudah diperbarui dari data hook.
      return prevDisplayedTim.map((timLama) => {
        const timBaru = timDariHook.find((t) => t.id === timLama.id);
        return timBaru ? timBaru : timLama; // Gunakan data baru jika ada
      });
    });

    // Langkah 2: Atur timer untuk memperbarui urutan setelah animasi skor selesai.
    const timer = setTimeout(() => {
      setDisplayedTim((prevDisplayedTim) => {
        // Sortir array berdasarkan skor terbaru untuk mendapatkan urutan yang benar.
        const timTerurutBaru = [...prevDisplayedTim].sort(
          (a, b) => b.skor - a.skor,
        );
        return timTerurutBaru;
      });
    }, SCORE_ANIMATION_DURATION * 1000); // Konversi detik ke milidetik

    // Cleanup function untuk membersihkan timer jika komponen unmount
    return () => clearTimeout(timer);
  }, [timDariHook]); // Efek ini hanya berjalan saat data dari hook berubah

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-slate-900 text-white p-8 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-6xl font-bold mb-12 tracking-wider">PAPAN SKOR</h1>

      <motion.div layout className="w-full max-w-4xl space-y-4">
        {/* 4. Render menggunakan state 'displayedTim' */}
        {displayedTim.map((t, index) => (
          <motion.div
            layout // Prop layout tetap di sini untuk animasi perpindahan
            transition={{ type: "spring", stiffness: 500, damping: 50 }}
            key={t.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-lg flex items-center p-6 shadow-lg"
          >
            <div className="text-5xl font-bold w-24 text-slate-400">
              #{index + 1}
            </div>
            <div className="text-4xl font-semibold flex-grow">{t.nama}</div>
            <div className="text-6xl font-bold text-yellow-400 w-48 text-right">
              <AnimatedCounter to={t.skor} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
