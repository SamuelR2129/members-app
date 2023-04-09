import { RecoilRoot } from "recoil";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import Contractors from "./pages/Contractors";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/contractors" element={<Contractors />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
