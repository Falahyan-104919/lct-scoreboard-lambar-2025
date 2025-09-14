// src/hooks/useLomba.js
import { useState, useEffect } from "react";

const LOMBA_STORAGE_KEY = "dataLombaSkorCermat";

// Fungsi untuk memuat data dari localStorage.
const loadInitialData = () => {
  try {
    const dataTersimpan = localStorage.getItem(LOMBA_STORAGE_KEY);
    if (dataTersimpan) {
      return JSON.parse(dataTersimpan);
    }
  } catch (error) {
    console.error("Gagal memuat data dari localStorage", error);
  }
  // Jika tidak ada data, kembalikan state default.
  return { namaLomba: "Lomba Cerdas Cermat", tim: [] };
};

export const useLomba = () => {
  // FIX 1: Lazy Initialization.
  // Fungsi ini hanya akan dijalankan SEKALI saat komponen pertama kali dibuat.
  // Ini mencegah masalah data ter-reset saat refresh.
  const [lombaData, setLombaData] = useState(loadInitialData);

  // Efek untuk MENYIMPAN data setiap kali lombaData berubah
  useEffect(() => {
    try {
      localStorage.setItem(LOMBA_STORAGE_KEY, JSON.stringify(lombaData));
    } catch (error) {
      console.error("Gagal menyimpan data ke localStorage", error);
    }
  }, [lombaData]);

  // FIX 2: Menggunakan event 'storage' untuk sinkronisasi antar-tab.
  // Efek ini akan berjalan ketika tab LAIN mengubah localStorage.
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === LOMBA_STORAGE_KEY) {
        // Muat ulang state dari data baru yang ada di localStorage
        setLombaData(loadInitialData());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener saat komponen tidak lagi digunakan
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Dependensi kosong agar hanya berjalan sekali.

  // --- Fungsi-fungsi untuk memanipulasi state ---

  const tambahTim = (namaTim) => {
    if (namaTim.trim() === "") return;
    const timBaru = {
      id: `tim-${Date.now()}`,
      nama: namaTim,
      skor: 0,
    };
    setLombaData((prevData) => ({
      ...prevData,
      tim: [...prevData.tim, timBaru],
    }));
  };

  const hapusTim = (id) => {
    setLombaData((prevData) => ({
      ...prevData,
      tim: prevData.tim.filter((t) => t.id !== id),
    }));
  };

  const updateSkor = (id, poin) => {
    setLombaData((prevData) => ({
      ...prevData,
      tim: prevData.tim.map((t) =>
        t.id === id ? { ...t, skor: t.skor + poin } : t,
      ),
    }));
  };

  const resetSkor = () => {
    setLombaData((prevData) => ({
      ...prevData,
      tim: prevData.tim.map((t) => ({ ...t, skor: 0 })),
    }));
  };

  const resetLomba = () => {
    setLombaData({ namaLomba: "Lomba Cerdas Cermat Baru", tim: [] });
  };

  // Kita tetap mengekspos `tim` dan `namaLomba` secara terpisah untuk kemudahan
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
