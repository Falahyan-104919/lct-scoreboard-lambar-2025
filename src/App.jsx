// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import ScoreboardPage from "./pages/ScoreboardPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <main className="container w-full">
        <Routes>
          <Route path="/" element={<AdminPage />} />
          <Route path="/scoreboard" element={<ScoreboardPage />} />
        </Routes>
        <Toaster />
      </main>
    </Router>
  );
}

export default App;
