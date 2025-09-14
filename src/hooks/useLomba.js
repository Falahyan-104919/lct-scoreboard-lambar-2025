// src/hooks/useLomba.js
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // 1. Import instance Firestore

// 2. Tentukan lokasi data kita di Firestore
// Kita akan menyimpan semua data lomba dalam satu dokumen
const lombaDocRef = doc(db, "lomba", "sesi-utama");

export const useLomba = () => {
  // State lokal untuk menampung data dari Firestore
  const [lombaData, setLombaData] = useState({
    namaLomba: "Memuat...",
    tim: [],
  });

  // 3. Gunakan onSnapshot untuk mendengarkan perubahan data secara real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(lombaDocRef, (docSnap) => {
      if (docSnap.exists()) {
        // Jika dokumen ada, update state lokal kita
        setLombaData(docSnap.data());
      } else {
        // Jika dokumen belum ada, buat dokumen awal
        console.log("Dokumen lomba belum ada, membuat data awal...");
        setDoc(lombaDocRef, { namaLomba: "Lomba Cerdas Cermat", tim: [] });
      }
    });

    // Cleanup listener saat komponen tidak lagi digunakan
    return () => unsubscribe();
  }, []); // Dependensi kosong agar hanya berjalan sekali

  // 4. Buat fungsi untuk MENULIS data ke Firestore
  const updateDataDiFirestore = async (dataBaru) => {
    try {
      await setDoc(lombaDocRef, dataBaru);
    } catch (error) {
      console.error("Gagal update data ke Firestore:", error);
    }
  };

  // --- Fungsi-fungsi untuk memanipulasi state ---
  // Sekarang, fungsi ini akan memanggil updateDataDiFirestore

  const tambahTim = (namaTim) => {
    if (namaTim.trim() === "") return;
    const timBaru = {
      id: `tim-${Date.now()}`,
      nama: namaTim,
      skor: 0,
    };
    const dataTerbaru = { ...lombaData, tim: [...lombaData.tim, timBaru] };
    updateDataDiFirestore(dataTerbaru);
  };

  const hapusTim = (id) => {
    const dataTerbaru = {
      ...lombaData,
      tim: lombaData.tim.filter((t) => t.id !== id),
    };
    updateDataDiFirestore(dataTerbaru);
  };

  const updateSkor = (id, poin) => {
    const dataTerbaru = {
      ...lombaData,
      tim: lombaData.tim.map((t) =>
        t.id === id ? { ...t, skor: t.skor + poin } : t,
      ),
    };
    updateDataDiFirestore(dataTerbaru);
  };

  const resetSkor = () => {
    const dataTerbaru = {
      ...lombaData,
      tim: lombaData.tim.map((t) => ({ ...t, skor: 0 })),
    };
    updateDataDiFirestore(dataTerbaru);
  };

  const resetLomba = () => {
    updateDataDiFirestore({ namaLomba: "Lomba Cerdas Cermat Baru", tim: [] });
  };

  // State yang diekspos tetap sama, komponen lain tidak perlu tahu perubahannya
  return {
    namaLomba: lombaData.namaLomba,
    tim: lombaData.tim,
    tambahTim,
    hapusTim,
    updateSkor,
    resetSkor,
    resetLomba,
  };
};
