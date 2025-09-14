// src/pages/AdminPage.jsx
import { useState } from "react";
import { useLomba } from "@/hooks/useLomba";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function AdminPage() {
  const { tim, tambahTim, hapusTim, updateSkor, resetSkor, resetLomba } =
    useLomba();
  const [namaTimBaru, setNamaTimBaru] = useState("");

  const [skorInputs, setSkorInputs] = useState({});

  const handleSkorInputChange = (timId, value) => {
    setSkorInputs((prevInputs) => ({
      ...prevInputs,
      [timId]: value,
    }));
  };

  const handleSkorSubmit = (timId) => {
    const nilaiInput = skorInputs[timId];

    const poin = parseInt(nilaiInput, 10);

    if (isNaN(poin)) {
      toast.error("Input Tidak Valid. Harap masukkan hanya angka.");
      return;
    }

    updateSkor(timId, poin);

    handleSkorInputChange(timId, "");
  };

  const handleTambahTim = () => {
    tambahTim(namaTimBaru);
    setNamaTimBaru("");
  };

  const handleBukaScoreboard = () => {
    window.open("/scoreboard", "_blank", "noopener,noreferrer");
  };

  const handleResetLomba = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin mereset seluruh data lomba? Aksi ini tidak dapat dibatalkan.",
      )
    ) {
      resetLomba();
      toast.success("Data lomba berhasil direset.");
    }
  };

  return (
    <div className="space-y-6 min-w-screen">
      <Card>
        <CardHeader>
          <CardTitle>Panel Admin Skor Cerdas Cermat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Masukkan nama tim baru"
              value={namaTimBaru}
              onChange={(e) => setNamaTimBaru(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTambahTim()}
            />
            <Button onClick={handleTambahTim}>Tambah Tim</Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleBukaScoreboard} variant="outline">
              Buka Papan Skor di Tab Baru
            </Button>
            <Button onClick={resetSkor} variant="secondary">
              Reset Semua Skor
            </Button>
            <Button onClick={handleResetLomba} variant="destructive">
              Reset Lomba
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manajemen Skor Tim</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Tim</TableHead>
                <TableHead className="text-right">Skor</TableHead>
                <TableHead className="text-center w-[300px]">
                  Ubah Skor (Gunakan +/-)
                </TableHead>
                <TableHead className="text-center w-[120px]">
                  Aksi Lain
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tim.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Belum ada tim yang ditambahkan.
                  </TableCell>
                </TableRow>
              ) : (
                tim.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.nama}</TableCell>
                    <TableCell className="text-right">{t.skor}</TableCell>

                    {/* --- PERUBAHAN TAMPILAN (JSX) --- */}
                    <TableCell className="flex justify-center gap-2">
                      <Input
                        type="text"
                        placeholder="e.g., 100 or -50"
                        className="w-32"
                        value={skorInputs[t.id] || ""} // Tampilkan nilai dari state, atau string kosong
                        onChange={(e) =>
                          handleSkorInputChange(t.id, e.target.value)
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSkorSubmit(t.id)
                        }
                      />
                      <Button size="sm" onClick={() => handleSkorSubmit(t.id)}>
                        Submit
                      </Button>
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => hapusTim(t.id)}
                      >
                        Hapus Tim
                      </Button>
                    </TableCell>
                    {/* --- AKHIR PERUBAHAN TAMPILAN (JSX) --- */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
