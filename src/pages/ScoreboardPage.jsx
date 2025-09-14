// src/pages/ScoreboardPage.jsx
import { useState, useEffect } from "react";
import { useLomba } from "@/hooks/useLomba";
import { motion, AnimatePresence } from "framer-motion"; // 1. Import AnimatePresence
import AnimatedCounter from "@/components/shared/AnimatedCounter";

const SCORE_ANIMATION_DURATION = 0.5;

export default function ScoreboardPage() {
  const { tim: timDariHook } = useLomba();
  const [displayedTim, setDisplayedTim] = useState([]);

  useEffect(() => {
    // --- AWAL BAGIAN YANG DIPERBAIKI ---
    setDisplayedTim((prevDisplayedTim) => {
      // Untuk render pertama kali, langsung isi dengan data yang sudah diurut.
      if (prevDisplayedTim.length === 0 && timDariHook.length > 0) {
        return [...timDariHook].sort((a, b) => b.skor - a.skor);
      }

      // Buat Peta (Map) dari data baru untuk pencarian yang cepat.
      const newDataMap = new Map(timDariHook.map((t) => [t.id, t]));

      // Buat daftar tim berikutnya.
      // Langkah A: Pertahankan tim lama yang masih ada, dan perbarui skornya.
      let nextState = prevDisplayedTim
        .map((oldTim) => newDataMap.get(oldTim.id)) // Ambil data baru berdasarkan ID lama
        .filter(Boolean); // Buang tim yang sudah dihapus (hasilnya akan undefined)

      // Langkah B: Tambahkan tim yang benar-benar baru.
      const existingIds = new Set(nextState.map((t) => t.id));
      const newItems = timDariHook.filter((t) => !existingIds.has(t.id));

      // Gabungkan daftar lama yang sudah diupdate dengan item yang baru.
      // Item baru akan muncul di bagian bawah untuk sementara.
      return [...nextState, ...newItems];
    });
    // --- AKHIR BAGIAN YANG DIPERBAIKI ---

    const timer = setTimeout(() => {
      setDisplayedTim((prevDisplayedTim) => {
        const timTerurutBaru = [...prevDisplayedTim].sort(
          (a, b) => b.skor - a.skor,
        );
        return timTerurutBaru;
      });
    }, SCORE_ANIMATION_DURATION * 1000);

    return () => clearTimeout(timer);
  }, [timDariHook]);

  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-slate-900 text-white p-8 overflow-hidden">
      <h1 className="text-6xl font-bold mb-2 tracking-wider">PAPAN SKOR</h1>
      {/* <h2 className="text-3xl font-bold mb-12 tracking-wider">Kelas SMP</h2>*/}

      {/* 2. Bungkus list dengan <AnimatePresence> untuk animasi keluar (exit) */}
      <motion.div layout className="w-full max-w-4xl space-y-4">
        <AnimatePresence>
          {displayedTim.map((t, index) => (
            <motion.div
              layout
              key={t.id}
              transition={{ type: "spring", stiffness: 500, damping: 50 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }} // Animasi saat tim dihapus
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
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
