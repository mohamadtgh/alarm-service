import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AlarmListPage from "./pages/AlarmListPage";
import AlarmDetailPage from "./pages/AlarmDetailPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<AlarmListPage />} />
            <Route path="/alarm/:id" element={<AlarmDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
