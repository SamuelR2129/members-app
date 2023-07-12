import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Tables from "./pages/Tables";
import Contractors from "./pages/Contractors";
import Navbar from "./components/Navbar";
import { SWRConfig } from "swr";
import axios from "axios";

function App() {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => axios.get(url).then((res) => res.data),
      }}
    >
      <Navbar />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/contractors" element={<Contractors />} />
      </Routes>
    </SWRConfig>
  );
}

export default App;
