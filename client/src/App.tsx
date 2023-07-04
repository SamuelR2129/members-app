import { Routes, Route } from "react-router-dom";
import MainFeed from "./pages/Feed";
import Tables from "./pages/Tables";
import Contractors from "./pages/Contractors";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<MainFeed />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/contractors" element={<Contractors />} />
      </Routes>
    </>
  );
}

export default App;
