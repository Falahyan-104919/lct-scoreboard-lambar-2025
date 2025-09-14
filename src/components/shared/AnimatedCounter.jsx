// src/components/shared/AnimatedCounter.jsx
import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

// Komponen ini menerima satu prop: `to`, yaitu angka tujuan
function AnimatedCounter({ to }) {
  const nodeRef = useRef(null);
  const from = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;

    // Simpan nilai 'from' saat pertama kali render atau saat nilai berubah
    // Jika belum ada nilai sebelumnya, mulai dari angka tujuan itu sendiri (tanpa animasi awal)
    const previousValue = from.current === null ? to : from.current;

    // Animasikan dari nilai sebelumnya ke nilai tujuan yang baru
    const controls = animate(previousValue, to, {
      duration: 0.5, // Durasi animasi dalam detik
      onUpdate(value) {
        // Bulatkan angka dan tampilkan di dalam elemen span
        if (node) {
          node.textContent = Math.round(value);
        }
      },
    });

    // Update nilai 'from' untuk animasi berikutnya
    from.current = to;

    // Hentikan animasi saat komponen di-unmount
    return () => controls.stop();
  }, [to]); // Jalankan efek ini setiap kali nilai 'to' berubah

  return <span ref={nodeRef} />;
}

export default AnimatedCounter;
