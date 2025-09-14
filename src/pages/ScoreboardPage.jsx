// src/pages/ScoreboardPage.jsx
import { useLomba } from "@/hooks/useLomba";
// 1. Import 'motion' dari framer-motion
import { motion } from "framer-motion";
// 2. Import komponen counter kita
import AnimatedCounter from "@/components/shared/AnimatedCounter";

export default function ScoreboardPage() {
  const { tim } = useLomba();

  const timTerurut = [...tim].sort((a, b) => b.skor - a.skor);

  return (
    // Kita gunakan motion.div sebagai container utama jika perlu animasi pada seluruh halaman
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-slate-900 text-white p-8 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-6xl font-bold mb-12 tracking-wider">PAPAN SKOR</h1>

      {/* 3. Gunakan motion.div sebagai container list untuk animasi layout */}
      <motion.div layout className="w-full max-w-4xl space-y-4">
        {timTerurut.map((t, index) => (
          // 4. Setiap item list juga harus motion.div dan memiliki prop 'layout'
          <motion.div
            layout // Ini adalah kunci untuk animasi perpindahan posisi!
            transition={{ type: "spring", stiffness: 500, damping: 50 }} // Animasi terasa 'membal'
            key={t.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-slate-800 border border-slate-700 rounded-lg flex items-center p-6 shadow-lg"
          >
            <div className="text-5xl font-bold w-24 text-slate-400">
              #{index + 1}
            </div>
            <div className="text-4xl font-semibold flex-grow">{t.nama}</div>
            <div className="text-6xl font-bold text-yellow-400 w-48 text-right">
              {/* 5. Ganti tampilan skor statis dengan komponen AnimatedCounter */}
              <AnimatedCounter to={t.skor} />
            </div>
          </motion.div>
        ))}

        {tim.length === 0 && (
          <p className="text-center text-2xl text-slate-400">
            Menunggu lomba dimulai...
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
